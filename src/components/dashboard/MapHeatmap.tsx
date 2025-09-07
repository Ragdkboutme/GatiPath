import { ZoomIn, ZoomOut, Layers, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import trafficHeatmap from "@/assets/traffic-heatmap.jpg";

export const MapHeatmap = () => {
  return (
    <div className="flex-1 relative bg-card rounded-lg border border-border overflow-hidden">
      {/* Map Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Card className="bg-card/90 backdrop-blur border-border/50">
          <CardContent className="p-2 flex gap-1">
            <Button variant="ghost" size="sm" className="p-2">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Navigation className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Layers className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Map Image */}
      <div className="relative h-full">
        <img 
          src={trafficHeatmap} 
          alt="Traffic Heatmap" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Elements */}
        <div className="absolute inset-0">
          {/* Route ETA Bubble */}
          <div className="absolute top-1/3 right-1/4">
            <Card className="bg-card/95 backdrop-blur border-primary/30 shadow-glow-primary">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Ring Road via Service</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">9 min</span>
                  <Badge variant="default" className="bg-flow-good text-primary-foreground">✓</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Tooltip (simulated hover) */}
          <div className="absolute top-1/2 left-1/3">
            <Card className="bg-card/95 backdrop-blur border-border/50 text-xs">
              <CardContent className="p-2 space-y-1">
                <div className="font-mono text-muted-foreground">segment_id: S-042</div>
                <div className="text-warning">avg_speed: 10 km/h</div>
                <div className="text-foreground">devices: 34</div>
                <div className="text-muted-foreground">last: 00:02:15 ago</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-card/90 backdrop-blur border-border/50">
          <CardContent className="p-3">
            <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Vehicles / Segment
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-flow-good"></div>
                <span className="text-xs text-foreground">0-40</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-flow-medium"></div>
                <span className="text-xs text-foreground">40-80</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-flow-heavy"></div>
                <span className="text-xs text-foreground">80+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};