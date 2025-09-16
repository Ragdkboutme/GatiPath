#!/usr/bin/env python3
"""
Vehicle Lane & Speed Detection (OpenCV + YOLOv8 + Supervision)
-------------------------------------------------------------

Features
- Detects vehicles (car, truck, bus, motorcycle, bicycle, train) with YOLOv8.
- Tracks objects across frames (ByteTrack via `supervision`).
- Assigns each vehicle to a lane (either auto-split lanes or user-defined polygons via JSON).
- Estimates speed per tracked vehicle in km/h when a homography (pixel->world plane in meters) is provided; otherwise shows px/s.
- Annotates frames with colored boxes (color per class), label, lane id, and speed.
- Saves annotated video.

Accuracy Notes
- For high accuracy speed, provide a proper homography using four or more image->world (meters) correspondences. See `--calib` JSON format below.
- Without calibration, speed is measured in pixels/second (still stable for *relative* speed, but not physically meaningful).
- For lane accuracy, define precise lane polygons in a `--lanes` JSON file; otherwise the frame is split into vertical lanes (default 3).

Installation (tested with Python 3.10/3.11)
    pip install ultralytics supervision opencv-python numpy scipy

Example usage
    # Detect with YOLOv8x for better accuracy, split into 3 auto lanes, show and save
    python vehicle_lane_speed.py --source input.mp4 --weights yolov8x.pt --out output.mp4 --show

    # Use custom lanes and calibrated speed (km/h)
    python vehicle_lane_speed.py --source input.mp4 --weights yolov8x.pt \
        --lanes lanes.json --calib calibration.json --out output.mp4 --show

`lanes.json` format (image coordinates; any number of lanes):
[
  {"id": 1, "name": "Lane 1", "polygon": [[50,700],[400,700],[420,100],[30,120]]},
  {"id": 2, "name": "Lane 2", "polygon": [[400,700],[800,700],[820,100],[420,100]]}
]

`calibration.json` format (at least 4 correspondences mapping image->world meters; world Z=0 plane):
{
  "fps": 30.0,
  "image_points": [[x1,y1],[x2,y2],[x3,y3],[x4,y4]],
  "world_points_m": [[X1,Y1],[X2,Y2],[X3,Y3],[X4,Y4]]
}

Tip: Pick world points on the road plane with measured distances (meters) between markings or lane corners. The homography computed from these points maps image->(X,Y) meters on the plane; speed is then computed as planar distance/time.

Keybindings while viewing (--show):
  q   Quit
  p   Pause/Resume

Author: ChatGPT (TARS)
"""
from __future__ import annotations
import argparse
import json
import os
from collections import defaultdict, deque
from dataclasses import dataclass
from typing import Deque, Dict, List, Optional, Tuple

import cv2
import numpy as np
from ultralytics import YOLO
import supervision as sv

# ------------------------- Config & Utilities ------------------------- #

# COCO class names used by YOLOv8 (80 classes)
COCO_CLASSES = [
    "person","bicycle","car","motorcycle","airplane","bus","train","truck","boat","traffic light",
    "fire hydrant","stop sign","parking meter","bench","bird","cat","dog","horse","sheep","cow",
    "elephant","bear","zebra","giraffe","backpack","umbrella","handbag","tie","suitcase","frisbee",
    "skis","snowboard","sports ball","kite","baseball bat","baseball glove","skateboard","surfboard","tennis racket","bottle",
    "wine glass","cup","fork","knife","spoon","bowl","banana","apple","sandwich","orange",
    "broccoli","carrot","hot dog","pizza","donut","cake","chair","couch","potted plant","bed",
    "dining table","toilet","tv","laptop","mouse","remote","keyboard","cell phone","microwave","oven",
    "toaster","sink","refrigerator","book","clock","vase","scissors","teddy bear","hair drier","toothbrush"
]

VEHICLE_CLASS_IDS = [1, 2, 3, 5, 6, 7]  # bicycle, car, motorcycle, bus, train, truck

# Distinct BGR colors for vehicle classes
CLASS_COLORS = {
    1: (255, 255, 0),   # bicycle - cyan-ish
    2: (0, 255, 0),     # car - green
    3: (0, 165, 255),   # motorcycle - orange
    5: (255, 0, 0),     # bus - blue
    6: (255, 0, 255),   # train - magenta
    7: (0, 0, 255),     # truck - red
}

@dataclass
class Calib:
    H: Optional[np.ndarray]  # 3x3 homography mapping image (x,y,1) -> world meters (X,Y,1)
    fps: Optional[float]

@dataclass
class Lane:
    lane_id: int
    name: str
    polygon: np.ndarray  # (N,2) float32 image coordinates

@dataclass
class TrackState:
    history_img: Deque[Tuple[float, Tuple[float, float]]]   # (time_sec, (x_img, y_img))
    history_world: Deque[Tuple[float, Tuple[float, float]]] # (time_sec, (X_m, Y_m))
    lane_history: Deque[int]


def load_calibration(path: Optional[str]) -> Calib:
    if path is None or not os.path.isfile(path):
        return Calib(H=None, fps=None)
    with open(path, 'r') as f:
        data = json.load(f)
    image_pts = np.array(data["image_points"], dtype=np.float32)
    world_pts = np.array(data["world_points_m"], dtype=np.float32)
    if image_pts.shape[0] < 4 or world_pts.shape[0] < 4:
        raise ValueError("calibration.json must have >=4 point correspondences")
    H, _ = cv2.findHomography(image_pts, world_pts, method=cv2.RANSAC, ransacReprojThreshold=3.0)
    fps = float(data.get("fps", 0)) or None
    return Calib(H=H, fps=fps)


def load_lanes(path: Optional[str], frame_w: int, frame_h: int, auto_n: int) -> List[Lane]:
    lanes: List[Lane] = []
    if path and os.path.isfile(path):
        with open(path, 'r') as f:
            data = json.load(f)
        for entry in data:
            polygon = np.array(entry["polygon"], dtype=np.float32)
            lanes.append(Lane(lane_id=int(entry["id"]), name=str(entry.get("name", f"Lane {entry['id']}")), polygon=polygon))
        return lanes
    # Auto vertical split
    step = frame_w / max(1, auto_n)
    for i in range(auto_n):
        x0 = int(round(i * step))
        x1 = int(round((i + 1) * step))
        poly = np.array([[x0, frame_h - 1], [x1, frame_h - 1], [x1, 0], [x0, 0]], dtype=np.float32)
        lanes.append(Lane(lane_id=i + 1, name=f"Lane {i + 1}", polygon=poly))
    return lanes


def point_in_lane(point_xy: Tuple[float, float], lanes: List[Lane]) -> Optional[int]:
    pt = tuple(point_xy)
    for lane in lanes:
        # cv2.pointPolygonTest expects contour (Nx1x2)
        contour = lane.polygon.reshape(-1, 1, 2).astype(np.float32)
        inside = cv2.pointPolygonTest(contour, pt, measureDist=False)
        if inside >= 0:  # inside or on edge
            return lane.lane_id
    return None


def transform_points(H: Optional[np.ndarray], pts: np.ndarray) -> np.ndarray:
    """Apply homography H to Nx2 points. Returns Nx2 array of world coords."""
    if H is None or pts.size == 0:
        return np.zeros_like(pts, dtype=np.float32)
    pts_h = cv2.convertPointsToHomogeneous(pts).reshape(-1, 3).T  # 3xN
    w = H @ pts_h  # 3xN
    w /= (w[2:3, :] + 1e-9)
    out = w[:2, :].T.astype(np.float32)
    return out


def compute_speed(history: Deque[Tuple[float, Tuple[float, float]]], use_world: bool, min_dt: float = 0.2, max_window: float = 1.0) -> Tuple[float, str]:
    """Compute speed from history.
    If use_world True -> units m/s; else px/s. Uses the earliest point within max_window seconds.
    Returns (speed_value, units_str)
    """
    if len(history) < 2:
        return 0.0, "px/s" if not use_world else "m/s"
    t_now, _ = history[-1]
    # Find the oldest point within window
    t_old = t_now
    p_old = history[-2][1]
    for t, p in reversed(history):
        if t_now - t > max_window:
            break
        t_old, p_old = t, p
    dt = max(1e-6, t_now - t_old)
    if dt < min_dt:
        return 0.0, "px/s" if not use_world else "m/s"
    p_now = history[-1][1]
    dx = p_now[0] - p_old[0]
    dy = p_now[1] - p_old[1]
    dist = float(np.hypot(dx, dy))
    unit = "m/s" if use_world else "px/s"
    return dist / dt, unit


def mps_to_kmh(v: float) -> float:
    return v * 3.6


def draw_lanes(frame: np.ndarray, lanes: List[Lane]) -> None:
    for lane in lanes:
        poly = lane.polygon.astype(np.int32)
        cv2.polylines(frame, [poly], isClosed=True, color=(80, 80, 80), thickness=2)
        # Put lane name at polygon centroid
        M = cv2.moments(poly)
        if abs(M["m00"]) > 1e-5:
            cx = int(M["m10"] / M["m00"]) ; cy = int(M["m01"] / M["m00"]) 
            cv2.putText(frame, lane.name, (cx - 30, cy), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (50, 50, 50), 2, cv2.LINE_AA)


# ------------------------- Main Pipeline ------------------------- #

def run(
    source: str,
    weights: str,
    out_path: Optional[str],
    lanes_path: Optional[str],
    n_auto_lanes: int,
    calib_path: Optional[str],
    conf: float,
    iou: float,
    device: Optional[str],
    show: bool,
    persist_window_s: float,
):
    # Load detector
    model = YOLO(weights)
    # Warm up will be handled by the first predict

    # Prepare video I/O
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        raise RuntimeError(f"Failed to open source: {source}")

    in_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    in_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

    calib = load_calibration(calib_path)
    fps = calib.fps or src_fps

    lanes = load_lanes(lanes_path, in_w, in_h, n_auto_lanes)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = None
    if out_path:
        writer = cv2.VideoWriter(out_path, fourcc, fps, (in_w, in_h))
        if not writer.isOpened():
            raise RuntimeError(f"Failed to open VideoWriter for: {out_path}")

    # Tracker (ByteTrack via supervision)
    byte_tracker = sv.ByteTrack()

    # State containers
    tracks: Dict[int, TrackState] = {}

    paused = False
    frame_idx = 0

    while True:
        if not paused:
            ret, frame = cap.read()
            if not ret:
                break
            t_sec = frame_idx / fps

            # YOLO inference
            results = model.predict(frame, verbose=False, conf=conf, iou=iou, device=device, classes=VEHICLE_CLASS_IDS)
            result = results[0]
            detections = sv.Detections.from_ultralytics(result)

            # Update tracker
            tracked = byte_tracker.update_with_detections(detections)

            # Draw lanes
            draw_lanes(frame, lanes)

            # Per-lane current counts
            lane_counts = defaultdict(int)

            # Iterate over tracks
            for i in range(len(tracked)):
                xyxy = tracked.xyxy[i]
                cls_id = int(tracked.class_id[i]) if tracked.class_id is not None else -1
                trk_id = int(tracked.tracker_id[i]) if tracked.tracker_id is not None else -1
                conf_i = float(tracked.confidence[i]) if tracked.confidence is not None else 0.0
                if trk_id < 0:
                    continue

                x1, y1, x2, y2 = map(float, xyxy)
                cx = (x1 + x2) / 2.0
                foot = (cx, y2)

                # Determine lane
                lane_id = point_in_lane(foot, lanes)
                if lane_id is None:
                    # fallback by horizontal split
                    lane_id = min(len(lanes), max(1, int(cx / (in_w / max(1, len(lanes)))) + 1))

                lane_counts[lane_id] += 1

                # Ensure track state
                if trk_id not in tracks:
                    tracks[trk_id] = TrackState(history_img=deque(maxlen=int(persist_window_s * fps) + 5),
                                                history_world=deque(maxlen=int(persist_window_s * fps) + 5),
                                                lane_history=deque(maxlen=30))
                state = tracks[trk_id]
                state.history_img.append((t_sec, foot))
                state.lane_history.append(lane_id)

                # Compute world coord if calibrated
                if calib.H is not None:
                    wpt = transform_points(calib.H, np.array([foot], dtype=np.float32))[0]
                    state.history_world.append((t_sec, (float(wpt[0]), float(wpt[1]))))

                # Compute speed
                if calib.H is not None and len(state.history_world) >= 2:
                    v, unit = compute_speed(state.history_world, use_world=True)
                    v_kmh = mps_to_kmh(v)
                    speed_str = f"{v_kmh:.1f} km/h"
                else:
                    v, unit = compute_speed(state.history_img, use_world=False)
                    if unit == "px/s":
                        speed_str = f"{v:.1f} px/s"
                    else:
                        speed_str = f"{mps_to_kmh(v):.1f} km/h"

                # Most common lane recent
                lane_recent = max(set(state.lane_history), key=state.lane_history.count) if state.lane_history else lane_id

                # Draw box & label
                color = CLASS_COLORS.get(cls_id, (200, 200, 200))
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                cls_name = COCO_CLASSES[cls_id] if 0 <= cls_id < len(COCO_CLASSES) else str(cls_id)
                label = f"{cls_name} | Lane {lane_recent} | {speed_str}"
                (tw, th), bl = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(frame, (int(x1), int(y1) - th - 6), (int(x1) + tw + 4, int(y1)), color, -1)
                cv2.putText(frame, label, (int(x1) + 2, int(y1) - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)

            # Overlay lane counts
            y_off = 24
            for lane in lanes:
                txt = f"{lane.name}: {lane_counts[lane.lane_id]}"
                cv2.putText(frame, txt, (10, y_off), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 3, cv2.LINE_AA)
                cv2.putText(frame, txt, (10, y_off), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1, cv2.LINE_AA)
                y_off += 24

            if writer is not None:
                writer.write(frame)

            if show:
                cv2.imshow("Vehicle Lane & Speed Detection", frame)
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    break
                elif key == ord('p'):
                    paused = True

            frame_idx += 1
        else:
            # paused state
            key = cv2.waitKey(50) & 0xFF
            if key == ord('p'):
                paused = False
            elif key == ord('q'):
                break

    cap.release()
    if writer is not None:
        writer.release()
    if show:
        cv2.destroyAllWindows()


# ------------------------- CLI ------------------------- #

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Vehicle lane & speed detection with YOLOv8 + OpenCV")
    parser.add_argument("--source", type=str, required=True, help="Path to input video file or camera index (e.g., 0)")
    parser.add_argument("--weights", type=str, default="yolov8x.pt", help="YOLOv8 weights path (e.g., yolov8x.pt)")
    parser.add_argument("--out", type=str, default="", help="Output video path (MP4). If empty, not saved")
    parser.add_argument("--lanes", type=str, default="", help="Path to lanes.json (optional)")
    parser.add_argument("--auto-lanes", type=int, default=3, help="Auto-split into N vertical lanes if --lanes not provided")
    parser.add_argument("--calib", type=str, default="", help="Path to calibration.json (optional) for km/h")
    parser.add_argument("--conf", type=float, default=0.35, help="YOLO confidence threshold")
    parser.add_argument("--iou", type=float, default=0.5, help="YOLO NMS IoU threshold")
    parser.add_argument("--device", type=str, default=None, help="Device for YOLO (e.g., 'cpu', '0')")
    parser.add_argument("--show", action="store_true", help="Show live preview window")
    parser.add_argument("--persist-window-s", type=float, default=1.5, help="Seconds of history used for smoothing speed")

    args = parser.parse_args()

    run(
        source=args.source,
        weights=args.weights,
        out_path=args.out if args.out else None,
        lanes_path=args.lanes if args.lanes else None,
        n_auto_lanes=max(1, args.auto_lanes),
        calib_path=args.calib if args.calib else None,
        conf=args.conf,
        iou=args.iou,
        device=args.device,
        show=args.show,
        persist_window_s=max(0.5, args.persist_window_s),
    )
