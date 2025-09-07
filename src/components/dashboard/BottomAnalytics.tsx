import { TrendingDown, Clock, AlertTriangle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TimeSeriesChart = () => (
  <div className="h-48 bg-secondary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
    {/* Simulated chart background */}
    <div className="absolute inset-0 opacity-10">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line key={i} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="hsl(var(--border))" strokeWidth="1"/>
        ))}
        
        {/* Sample data lines */}
        <polyline
          fill="none"
          stroke="hsl(var(--flow-heavy))"
          strokeWidth="2"
          points="0,120 50,125 100,130 150,135 200,140 250,130 300,120 350,115 400,110"
        />
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          points="0,140 50,135 100,125 150,115 200,105 250,95 300,90 350,85 400,80"
        />
        
        {/* Fill area under RL line */}
        <polygon
          fill="url(#chartGradient)"
          points="0,140 50,135 100,125 150,115 200,105 250,95 300,90 350,85 400,80 400,200 0,200"
        />
      </svg>
    </div>
    
    {/* Chart content overlay */}
    <div className="relative z-10 text-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-flow-heavy rounded-full"></div>
          <span className="text-xs text-muted-foreground">Fixed Timer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-xs text-muted-foreground">RL Engine</span>
        </div>
      </div>
      <Badge variant="default" className="bg-flow-good text-primary-foreground">
        <TrendingDown className="w-3 h-3 mr-1" />
        10% Reduction in Wait Time
      </Badge>
    </div>
  </div>
);

const EventsFeed = () => {
  const events = [
    { time: "08:45", type: "pothole", message: "Pothole detected (Segment S-042)", variant: "destructive" as const },
    { time: "08:40", type: "rl", message: "RL applied NS 25s (Δ wait -6%)", variant: "default" as const },
    { time: "08:38", type: "violation", message: "Red-light violation detected", variant: "destructive" as const },
    { time: "08:35", type: "weather", message: "Rain sensor: Heavy (3 devices)", variant: "secondary" as const },
    { time: "08:32", type: "congestion", message: "Congestion spike: Segment S-041", variant: "destructive" as const },
    { time: "08:30", type: "rl", message: "RL confidence improved to 89%", variant: "default" as const },
  ];

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {events.map((event, index) => (
        <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
          <span className="font-mono text-xs text-muted-foreground mt-0.5">{event.time}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">{event.message}</span>
              {event.type === "pothole" && <AlertTriangle className="w-3 h-3 text-destructive" />}
              {event.type === "rl" && <TrendingDown className="w-3 h-3 text-primary" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const BottomAnalytics = () => {
  return (
    <div className="border-t border-border p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card className="bg-gradient-panel border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Performance Comparison — Past Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart />
          </CardContent>
        </Card>

        {/* Events & Alerts */}
        <Card className="bg-gradient-panel border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Events & Alerts
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventsFeed />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};