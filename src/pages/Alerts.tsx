import { useState } from 'react';
import { AlertTriangle, Filter, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/dashboard/TopBar";

const EventsFeed = () => {
  const events = [
    { time: "08:45", type: "pothole", message: "Pothole detected (Segment S-042)", variant: "destructive" as const },
    { time: "08:40", type: "rl", message: "RL applied NS 25s (Δ wait -6%)", variant: "default" as const },
    { time: "08:38", type: "violation", message: "Red-light violation detected", variant: "destructive" as const },
    { time: "08:35", type: "weather", message: "Rain sensor: Heavy (3 devices)", variant: "secondary" as const },
    { time: "08:32", type: "congestion", message: "Congestion spike: Segment S-041", variant: "destructive" as const },
    { time: "08:30", type: "rl", message: "RL confidence improved to 89%", variant: "default" as const },
    { time: "08:25", type: "pothole", message: "Pothole detected (Segment S-039)", variant: "destructive" as const },
    { time: "08:20", type: "rl", message: "RL applied EW 30s (Δ wait -8%)", variant: "default" as const },
    { time: "08:15", type: "violation", message: "Speed violation detected", variant: "destructive" as const },
    { time: "08:10", type: "weather", message: "Rain sensor: Medium (5 devices)", variant: "secondary" as const },
  ];

  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto p-4">
      {events.map((event, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
          <span className="font-mono text-xs text-muted-foreground mt-0.5">{event.time}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">{event.message}</span>
              {event.type === "pothole" && <AlertTriangle className="w-3 h-3 text-destructive" />}
              {event.type === "rl" && <Clock className="w-3 h-3 text-primary" />}
            </div>
          </div>
          <Badge variant={event.variant} className="ml-2">
            {event.type.toUpperCase()}
          </Badge>
        </div>
      ))}
    </div>
  );
};

const Alerts = () => {
  const [isOdia, setIsOdia] = useState(false);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <TopBar isOdia={isOdia} setIsOdia={setIsOdia} timeRange="live" />
      
      <div className="container mx-auto p-6">
        <Card className="bg-gradient-panel border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {isOdia ? "ଚେତାବନୀ ଏବଂ ଘଟଣା" : "Alerts & Events"}
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="w-3 h-3 mr-1" />
                {isOdia ? "ଫିଲ୍ଟର" : "Filter"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventsFeed />
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="border-t border-border px-6 py-3">
        <p className="text-xs text-muted-foreground">
          {isOdia 
            ? "କେବଳ ଅପରେଟରମାନଙ୍କ ପାଇଁ — କଞ୍ଚା CCTV ଆକସେସ୍ ଅକ୍ଷମ; କେବଳ ଏକତ୍ରିତ ଫିଡ୍" 
            : "For operators only — raw CCTV access disabled; aggregated feeds only"
          }
        </p>
      </div>
    </div>
  );
};

export default Alerts;