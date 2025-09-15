import { useState } from 'react';
import { TrendingDown, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/dashboard/TopBar";

const TimeSeriesChart = ({ isOdia }: { isOdia?: boolean }) => (
  <div className="h-64 bg-secondary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
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

const Analytics = () => {
  const [isOdia, setIsOdia] = useState(false);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <TopBar isOdia={isOdia} setIsOdia={setIsOdia} />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Series Chart */}
          <Card className="bg-gradient-panel border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isOdia ? "ପ୍ରଦର୍ଶନ ତୁଳନା — ଗତ ଘଣ୍ଟା" : "Performance Comparison — Past Hour"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart isOdia={isOdia} />
            </CardContent>
          </Card>
          
          {/* Traffic Flow Analysis */}
          <Card className="bg-gradient-panel border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                {isOdia ? "ଟ୍ରାଫିକ୍ ପ୍ରବାହ ବିଶ୍ଳେଷଣ" : "Traffic Flow Analysis"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">{isOdia ? "ଜଙ୍କସନ୍ J1 ପ୍ରଦର୍ଶନ" : "Junction J1 Performance"}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{isOdia ? "ଅପେକ୍ଷା ସମୟ" : "Wait Time"}</p>
                      <p className="text-lg font-bold text-primary">-15%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isOdia ? "ଥ୍ରୁପୁଟ୍" : "Throughput"}</p>
                      <p className="text-lg font-bold text-primary">+8%</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">{isOdia ? "ଜଙ୍କସନ୍ J2 ପ୍ରଦର୍ଶନ" : "Junction J2 Performance"}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{isOdia ? "ଅପେକ୍ଷା ସମୟ" : "Wait Time"}</p>
                      <p className="text-lg font-bold text-destructive">+5%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{isOdia ? "ଥ୍ରୁପୁଟ୍" : "Throughput"}</p>
                      <p className="text-lg font-bold text-destructive">-3%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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

export default Analytics;