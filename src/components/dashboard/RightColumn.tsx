import { Video, Eye, Brain, Zap, Cloud, Thermometer, Wind, Activity, Battery, Wifi, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EventsFeed } from "./EventsFeed";
import { useState, useEffect } from "react";

interface VehicleCounts {
  cars: number;
  buses: number;
  bikes: number;
}

const CCTVTile = ({ 
  camera, 
  location, 
  status, 
  vehicleCounts,
  junction,
  isOdia = false
}: { 
  camera: string; 
  location: string; 
  status: "online" | "offline";
  vehicleCounts: VehicleCounts;
  junction: string;
  isOdia?: boolean;
}) => (
  <div className="relative bg-secondary rounded-md overflow-hidden border border-border h-64">
    {/* Junction Header */}
    <div className="absolute top-0 left-0 right-0 bg-primary/90 backdrop-blur px-2 py-1 z-10">
      <div className="text-xs text-primary-foreground font-medium text-center">{junction}</div>
    </div>

    {/* Camera Info Header - Fixed position below junction */}
    <div className="absolute top-7 left-2 right-2 z-20">
      <div className="bg-slate-800/95 backdrop-blur rounded px-2 py-1.5 border border-slate-600/50 shadow-lg">
        <div className="text-xs text-slate-100 font-medium text-center">{camera} — {location}</div>
      </div>
    </div>

    {/* Video feed area */}
    <div className="absolute inset-0 mt-16 bg-gradient-to-br from-muted/30 to-muted/10">
      <div className="absolute inset-2 border-2 border-dashed border-muted-foreground/30 rounded"></div>
      <div className="absolute top-2 right-2">
        <Badge variant={status === "online" ? "default" : "destructive"} className="text-xs px-1 py-0">
          {status === "online" ? (isOdia ? "ଲାଇଭ୍" : "LIVE") : (isOdia ? "ବନ୍ଦ" : "OFF")}
        </Badge>
      </div>
    </div>
    
    {/* Vehicle Count Display - Bottom section */}
    <div className="absolute bottom-2 left-2 right-2">
      <div className="bg-card/95 backdrop-blur rounded-md px-3 py-3 border border-border/50">
        {status === "online" ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-blue-500/10 rounded px-2 py-1.5 border border-blue-500/20">
              <span className="text-blue-300 text-xs font-medium">{isOdia ? "କାର:" : "Cars:"}</span>
              <span className="text-blue-200 text-sm font-bold">{vehicleCounts.cars}</span>
            </div>
            <div className="flex justify-between items-center bg-green-500/10 rounded px-2 py-1.5 border border-green-500/20">
              <span className="text-green-300 text-xs font-medium">{isOdia ? "ବସ୍:" : "Buses:"}</span>
              <span className="text-green-200 text-sm font-bold">{vehicleCounts.buses}</span>
            </div>
            <div className="flex justify-between items-center bg-yellow-500/10 rounded px-2 py-1.5 border border-yellow-500/20">
              <span className="text-yellow-300 text-xs font-medium">{isOdia ? "ବାଇକ୍:" : "Bikes:"}</span>
              <span className="text-yellow-200 text-sm font-bold">{vehicleCounts.bikes}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-red-400 text-center py-3 bg-red-500/10 rounded border border-red-500/20">
            {isOdia ? "ଅଫଲାଇନ୍ - କୌଣସି ଡାଟା ନାହିଁ" : "Offline - No data"}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const RightColumn = ({ isOdia = false }: { isOdia?: boolean }) => {
  // State for vehicle counts for each camera
  const [vehicleCounts, setVehicleCounts] = useState<Record<string, VehicleCounts>>({
    "Cam J1-01": { cars: 12, buses: 2, bikes: 18 },
    "Cam J1-02": { cars: 8, buses: 1, bikes: 15 },
    "Cam J1-03": { cars: 10, buses: 1, bikes: 14 }, // now online
    "Cam J1-04": { cars: 15, buses: 3, bikes: 22 }
  });

  // Function to simulate realistic vehicle count changes
  const generateVehicleUpdate = (currentCounts: VehicleCounts, isOnline: boolean): VehicleCounts => {
    if (!isOnline) return { cars: 0, buses: 0, bikes: 0 };
    
    return {
      cars: Math.max(0, currentCounts.cars + Math.floor(Math.random() * 7) - 3), // -3 to +3 change
      buses: Math.max(0, currentCounts.buses + Math.floor(Math.random() * 3) - 1), // -1 to +1 change
      bikes: Math.max(0, currentCounts.bikes + Math.floor(Math.random() * 9) - 4) // -4 to +4 change
    };
  };

  // Update vehicle counts every 2-3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleCounts(prev => ({
        "Cam J1-01": generateVehicleUpdate(prev["Cam J1-01"], true),
        "Cam J1-02": generateVehicleUpdate(prev["Cam J1-02"], true),
        "Cam J1-03": generateVehicleUpdate(prev["Cam J1-03"], true), // now online
        "Cam J1-04": generateVehicleUpdate(prev["Cam J1-04"], true)
      }));
    }, 2000 + Math.random() * 1000); // 2-3 seconds interval

    return () => clearInterval(interval);
  }, []);

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
          <div className="grid grid-cols-1 gap-3">
            <CCTVTile
              camera="Cam J1-01"
              location={isOdia ? "ଜୟଦେବ ବିହାର" : "Jaydev Vihar"}
              status="online"
              vehicleCounts={vehicleCounts["Cam J1-01"]}
              junction={isOdia ? "ଜୟଦେବ ବିହାର ଜଙ୍କସନ" : "Jaydev Vihar Junction"}
              isOdia={isOdia}
            />
            <CCTVTile
              camera="Cam J1-02"
              location={isOdia ? "ମାଷ୍ଟର କ୍ୟାଣ୍ଟିନ" : "Master Canteen"}
              status="online"
              vehicleCounts={vehicleCounts["Cam J1-02"]}
              junction={isOdia ? "ମାଷ୍ଟର କ୍ୟାଣ୍ଟିନ ଚକ" : "Master Canteen Square"}
              isOdia={isOdia}
            />
            <CCTVTile
              camera="Cam J1-03"
              location={isOdia ? "ନନ୍ଦନକାନନ ରୋଡ୍" : "Nandankanan Road"}
              status="online"
              vehicleCounts={vehicleCounts["Cam J1-03"]}
              junction={isOdia ? "ନନ୍ଦନକାନନ ରୋଡ୍ ଜଙ୍କସନ" : "Nandankanan Road Junction"}
              isOdia={isOdia}
            />
            <CCTVTile
              camera="Cam J1-04"
              location={isOdia ? "ପାଟିଆ ଚକ" : "Patia Square"}
              status="online"
              vehicleCounts={vehicleCounts["Cam J1-04"]}
              junction={isOdia ? "ପାଟିଆ ଚକ ଜଙ୍କସନ" : "Patia Square Junction"}
              isOdia={isOdia}
            />
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
          {isOdia ? "ସାମ୍ପ୍ରତିକ ଘଟଣା" : "Recent Events"}
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
          <Cloud className="w-4 h-4" />
          {isOdia ? "IoT ଏବଂ ପରିବେଶ" : "IoT & Environment"}
        </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weather */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-sm">{isOdia ? "ତାପମାତ୍ରା" : "Temperature"}</span>
              </div>
              <span className="text-sm font-bold">32°C</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-400" />
                <span className="text-sm">{isOdia ? "ପବନ ବେଗ" : "Wind Speed"}</span>
              </div>
              <span className="text-sm font-bold">{isOdia ? "12 କିମି/ଘଣ୍ଟା" : "12 km/h"}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm">{isOdia ? "ବାୟୁ ଗୁଣବତ୍ତା" : "Air Quality"}</span>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                {isOdia ? "ଭଲ" : "Good"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{isOdia ? "ସେନ୍ସର ସ୍ୱାସ୍ଥ୍ୟ" : "Sensor Health"}</span>
              </div>
              <span className="text-sm font-bold text-yellow-400">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span className="text-sm">{isOdia ? "ନେଟୱାର୍କ ସ୍ଥିତି" : "Network Status"}</span>
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                {isOdia ? "ଅନଲାଇନ୍" : "Online"}
              </Badge>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};