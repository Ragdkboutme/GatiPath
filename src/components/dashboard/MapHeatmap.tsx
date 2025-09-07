import { ZoomIn, ZoomOut, Layers, Navigation, Route, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import bhubaneswarMap from "@/assets/bhubaneswar-map.jpg";
import { useState } from "react";

export const MapHeatmap = ({ isOdia = false }: { isOdia?: boolean }) => {
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const translations = {
    vehiclesSegment: isOdia ? "ଯାନବାହନ / ବିଭାଗ" : "Vehicles / Segment",
    mainRoute: isOdia ? "ମୁଖ୍ୟ ପଥ" : "Main Route",
    altRoute: isOdia ? "ବିକଳ୍ପ ପଥ" : "Alt Route",
    heavy: isOdia ? "ଭାରୀ" : "Heavy",
    applyAdvisory: isOdia ? "ପରାମର୍ଶ ଲାଗୁ କରନ୍ତୁ" : "Apply Advisory"
  };
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
            <Button 
              variant={showRoutes ? "default" : "ghost"} 
              size="sm" 
              className="p-2"
              onClick={() => setShowRoutes(!showRoutes)}
            >
              <Route className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Layers className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Map Image with Route Overlays */}
      <div className="relative h-full">
        <img 
          src={bhubaneswarMap} 
          alt="Bhubaneswar Traffic Map" 
          className="w-full h-full object-cover"
        />
        
        {/* Heat Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Congested segment - Janpath area */}
          <div 
            className="absolute w-24 h-8 bg-gradient-to-r from-flow-heavy/40 to-warning/30 rounded-full blur-sm"
            style={{ top: '45%', left: '35%', transform: 'rotate(25deg)' }}
          ></div>
          
          {/* Medium congestion - Ring Road */}
          <div 
            className="absolute w-32 h-6 bg-gradient-to-r from-warning/35 to-flow-medium/30 rounded-full blur-sm"
            style={{ top: '60%', left: '25%', transform: 'rotate(-15deg)' }}
          ></div>
          
          {/* Good flow - Outer areas */}
          <div 
            className="absolute w-28 h-5 bg-gradient-to-r from-flow-good/30 to-flow-good/20 rounded-full blur-sm"
            style={{ top: '30%', left: '55%', transform: 'rotate(45deg)' }}
          ></div>
        </div>

        {/* Route Overlays */}
        {showRoutes && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Primary congested route - thick red line */}
            <path
              d="M 650 350 Q 750 370 850 320 Q 950 270 1100 290"
              stroke="#E53935"
              strokeWidth="6"
              fill="none"
              strokeDasharray="none"
              className="drop-shadow-sm"
            />
            
            {/* Alternative route - dashed teal line */}
            <path
              d="M 650 350 Q 700 450 800 480 Q 900 510 1100 290"
              stroke="#00BFA6"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8,8"
              className="drop-shadow-sm"
            />
            
            {/* Route direction arrows */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#00BFA6" />
              </marker>
            </defs>
            
            <path
              d="M 950 480 L 1000 430"
              stroke="#00BFA6"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              fill="none"
            />
          </svg>
        )}
        
        {/* Overlay Elements */}
        <div className="absolute inset-0">
          {/* Primary Route ETA Bubble */}
          <div className="absolute" style={{ top: '25%', right: '15%' }}>
            <Card className="bg-card/95 backdrop-blur border-destructive/30 shadow-glow-danger">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  {translations.mainRoute}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-destructive">{isOdia ? "18 ମିନିଟ" : "18 min"}</span>
                  <Badge variant="destructive" className="text-xs">{translations.heavy}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alternative Route ETA Bubble */}
          <div className="absolute" style={{ top: '55%', right: '25%' }}>
            <Card className="bg-card/95 backdrop-blur border-primary/30 shadow-glow-primary">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-primary" />
                  {translations.altRoute}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{isOdia ? "11 ମିନିଟ" : "11 min"}</span>
                  <Badge variant="default" className="bg-flow-good text-primary-foreground">−39%</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isOdia ? "+0.8 କିମି • 7 ମିନିଟ ସାଞ୍ଚିତ" : "+0.8 km • Save 7 min"}
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
                <div className="text-primary text-xs mt-2 flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                    {translations.applyAdvisory}
                  </Button>
                </div>
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
              {translations.vehiclesSegment}
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