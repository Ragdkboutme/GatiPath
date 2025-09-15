import { Video, Eye, Brain, Zap, Cloud, Thermometer, Wind, Activity, Battery, Wifi, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EventsFeed } from "./EventsFeed";

const CCTVTile = ({ camera, location, status }: { camera: string; location: string; status: "online" | "offline" }) => (
  <div className="relative aspect-video bg-secondary rounded-md overflow-hidden border border-border">
    {/* Simulated blurred video feed */}
    <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm">
      <div className="absolute inset-2 border-2 border-dashed border-muted-foreground/30 rounded"></div>
      <div className="absolute top-2 left-2 text-xs text-muted-foreground">BLURRED</div>
      <div className="absolute top-2 right-2">
        <Badge variant={status === "online" ? "default" : "destructive"} className="text-xs px-1 py-0">
          {status === "online" ? "LIVE" : "OFF"}
        </Badge>
      </div>
    </div>
    
    {/* Detection overlays */}
    <div className="absolute bottom-2 left-2 right-2">
      <div className="bg-card/90 backdrop-blur rounded px-2 py-1">
        <div className="text-xs text-muted-foreground">{camera} — {location}</div>
        <div className="text-xs text-foreground">Cars: 12 | Buses: 2 | Bikes: 18</div>
      </div>
    </div>
  </div>
);

export const RightColumn = ({ isOdia = false }: { isOdia?: boolean }) => {
  return (
    <div className="w-80 border-l border-border bg-gradient-panel p-4 flex flex-col gap-6 h-full overflow-y-auto">
      {/* CCTV Panel */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Video className="w-4 h-4" />
            {isOdia ? "ଲାଇଭ CCTV — ଗୋପନୀୟତା ପ୍ରଥମ" : "Live CCTV — Privacy First"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <CCTVTile camera="Cam J1-01" location="Edge: Jetson X" status="online" />
            <CCTVTile camera="Cam J1-02" location="Edge: Jetson Y" status="online" />
            <CCTVTile camera="Cam J1-03" location="Edge: Jetson Z" status="offline" />
            <CCTVTile camera="Cam J1-04" location="Edge: Jetson W" status="online" />
          </div>
          <div className="text-xs text-muted-foreground bg-muted/20 rounded p-2">
            <Eye className="w-3 h-3 inline mr-1" />
            {isOdia ? "ଏଜ-ପ୍ରକ୍ରିୟାକରଣ — ଗୋପନୀୟତା ପାଇଁ ଅସ୍ପଷ୍ଟ" : "Edge-processed — blurred for privacy"}
          </div>
        </CardContent>
      </Card>

      {/* RL Decision Panel */}
      <Card className="bg-gradient-panel border-border/50 shadow-glow-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Brain className="w-4 h-4" />
            {isOdia ? "RL ଇଞ୍ଜିନ — Q-Flow v1.2" : "RL Engine — Q-Flow v1.2"}
            <Badge variant="default" className="bg-flow-good text-primary-foreground ml-auto">ON</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Decision */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">{isOdia ? "ବର୍ତ୍ତମାନ କାର୍ଯ୍ୟ" : "Current Action"}</div>
            <div className="text-lg font-bold text-primary">{isOdia ? "ଫେଜ: NS_GREEN" : "Phase: NS_GREEN"}</div>
            <div className="text-2xl font-bold text-foreground">{isOdia ? "ଅବଧି: 25s" : "Duration: 25s"}</div>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">{isOdia ? "ଆତ୍ମବିଶ୍ୱାସ" : "Confidence"}</span>
              <span className="text-foreground font-medium">82%</span>
            </div>
            <Progress value={82} className="h-2" />
          </div>

          {/* Reason */}
          <div className="bg-muted/20 rounded p-3">
            <div className="text-xs text-muted-foreground mb-1">{isOdia ? "ନିଷ୍ପତ୍ତି କାରଣ" : "Decision Reason"}</div>
            <div className="text-sm text-foreground">
              {isOdia ? "2 ମିନିଟରେ N-S ଉଚ୍ଚ ପ୍ରବାହ ଅନୁମାନ (GPS + CCTV + IoT ବର୍ଷା ଫ୍ଲାଗ)" : "Predicted inflow N-S high in 2 min (GPS + CCTV + IoT rain flag)"}
            </div>
          </div>

          {/* Recent Decisions */}
          <div>
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">{isOdia ? "ଶେଷ 5 ନିଷ୍ପତ୍ତି" : "Last 5 Decisions"}</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-mono text-muted-foreground">08:45</span>
                <span className="text-foreground">NS 25s</span>
                <span className="text-flow-good">-6%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-muted-foreground">08:43</span>
                <span className="text-foreground">EW 30s</span>
                <span className="text-flow-good">-4%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-muted-foreground">08:41</span>
                <span className="text-foreground">NS 20s</span>
                <span className="text-flow-medium">+2%</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Force Apply
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 text-xs">
              Shadow Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events & Alerts */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Events & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventsFeed isOdia={isOdia} />
        </CardContent>
      </Card>

      {/* IoT & Weather */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {isOdia ? "IoT ଏବଂ ପରିବେଶ" : "IoT & Environment"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weather */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-foreground">Light Rain — 22°C</div>
                <div className="text-xs text-warning">Adjusting cycle ↑10%</div>
              </div>
            </div>
          </div>

          {/* AQI */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground flex items-center gap-2">
                <Wind className="w-4 h-4 text-muted-foreground" />
                AQI: 186
              </span>
              <Badge variant="destructive" className="text-xs">Unhealthy</Badge>
            </div>
            <div className="text-xs text-muted-foreground">auto-adjust timings enabled</div>
          </div>

          {/* Road Health */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Pothole alerts</span>
            <Badge variant="destructive" className="text-xs">2 active</Badge>
          </div>

          {/* Connectivity */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-flow-good" />
              <span className="text-xs text-muted-foreground">Battery: 94%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-flow-good" />
              <span className="text-xs text-muted-foreground">34 devices</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};