import { useState } from 'react';
import { BarChart2, TrendingUp, Clock, MapPin, Users, AlertTriangle, Activity, Zap, Download, Share2, Settings, ChevronDown, TrendingDown, Eye, Layers, Filter, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/dashboard/TopBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface KPIData {
  active_alerts: number;
  potholes_today: number;
  violations: number;
  rl_confidence: number;
  avg_speed: number;
  resolved_today: number;
}

interface TimeseriesData {
  timestamp: string;
  rl_wait: number;
  fixed_wait: number;
}

interface JunctionData {
  id: string;
  name: string;
  lat: number;
  lon: number;
  wait_before: number;
  wait_after: number;
  throughput_delta: number;
}

interface IncidentData {
  date: string;
  potholes: number;
  violations: number;
  emergency: number;
}

interface RLMetrics {
  success_rate: number;
  avg_confidence: number;
  interventions: number;
}

const Analytics = () => {
  const [isOdia, setIsOdia] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showJunctionModal, setShowJunctionModal] = useState(false);
  const [selectedJunction, setSelectedJunction] = useState<JunctionData | null>(null);
  const [mapLayers, setMapLayers] = useState({
    congestion: true,
    sensors: true,
    cctv: false,
    junctions: true
  });

  // Sample data matching the required schema
  const kpis: KPIData = {
    active_alerts: 8,
    potholes_today: 12,
    violations: 30,
    rl_confidence: 88,
    avg_speed: 30,
    resolved_today: 24
  };

  const timeseries_wait: TimeseriesData[] = [
    {"timestamp":"2025-09-15T11:00:00Z","rl_wait":35,"fixed_wait":42},
    {"timestamp":"2025-09-15T11:15:00Z","rl_wait":32,"fixed_wait":40},
    {"timestamp":"2025-09-15T11:30:00Z","rl_wait":28,"fixed_wait":38},
    {"timestamp":"2025-09-15T11:45:00Z","rl_wait":30,"fixed_wait":41}
  ];

  const junctions: JunctionData[] = [
    {"id":"J1","name":"Jaydev Vihar","lat":20.2961,"lon":85.8245,"wait_before":45,"wait_after":38,"throughput_delta":8},
    {"id":"J2","name":"Master Canteen","lat":20.2942,"lon":85.8213,"wait_before":52,"wait_after":41,"throughput_delta":12},
    {"id":"J3","name":"Kalinga Square","lat":20.2889,"lon":85.8167,"wait_before":38,"wait_after":35,"throughput_delta":5}
  ];

  const incidents_30d: IncidentData[] = [
    {"date":"2025-08-17","potholes":3,"violations":10,"emergency":1},
    {"date":"2025-08-18","potholes":5,"violations":8,"emergency":0},
    {"date":"2025-08-19","potholes":2,"violations":12,"emergency":2}
  ];

  const rl_metrics: RLMetrics = {"success_rate":0.78,"avg_confidence":0.86,"interventions":120};

  const toggleMapLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const openJunctionModal = (junction: JunctionData) => {
    setSelectedJunction(junction);
    setShowJunctionModal(true);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar isOdia={isOdia} setIsOdia={setIsOdia} timeRange="live" />
      
      <div className="p-6 space-y-6">
        {/* Top KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-panel border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">{isOdia ? 'ସକ୍ରିୟ ଚେତାବନୀ' : 'Active Alerts'}</p>
                  <p className="text-lg font-bold text-destructive">{kpis.active_alerts}</p>
                  <div className="flex items-center text-xs text-green-400">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    ▼ 2
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-panel border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs text-muted-foreground">{isOdia ? 'ଆଜି ଗର୍ତ୍ତ' : 'Potholes Today'}</p>
                  <p className="text-lg font-bold text-amber-400">{kpis.potholes_today}</p>
                  <div className="flex items-center text-xs text-red-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ▲ 3
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-panel border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-red-400" />
                <div>
                  <p className="text-xs text-muted-foreground">{isOdia ? 'ଉଲ୍ଲଂଘନ' : 'Violations'}</p>
                  <p className="text-lg font-bold text-red-400">{kpis.violations}</p>
                  <div className="flex items-center text-xs text-green-400">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    ▼ 5
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-panel border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{isOdia ? 'RL ବିଶ୍ୱାସ' : 'RL Confidence'}</p>
                  <p className="text-lg font-bold text-primary">{kpis.rl_confidence}%</p>
                  <div className="flex items-center text-xs text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ▲ 2%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-panel border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-muted-foreground">{isOdia ? 'ଔସତ ଗତି' : 'Avg Speed'}</p>
                  <p className="text-lg font-bold text-blue-400">{kpis.avg_speed} {isOdia ? 'କିମି/ଘଣ୍ଟା' : 'km/h'}</p>
                  <div className="flex items-center text-xs text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ▲ 5
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-panel border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-xs text-muted-foreground">{isOdia ? 'ଆଜି ସମାଧାନ' : 'Resolved Today'}</p>
                  <p className="text-lg font-bold text-green-400">{kpis.resolved_today}</p>
                  <div className="flex items-center text-xs text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ▲ 8
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-panel border border-border/50 rounded-lg">
          <div className="flex items-center gap-4">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">{isOdia ? 'ଶେଷ ୧ ଘଣ୍ଟା' : 'Last 1h'}</SelectItem>
                <SelectItem value="6h">{isOdia ? 'ଶେଷ ୬ ଘଣ୍ଟା' : 'Last 6h'}</SelectItem>
                <SelectItem value="24h">{isOdia ? 'ଶେଷ ୨୪ ଘଣ୍ଟା' : 'Last 24h'}</SelectItem>
                <SelectItem value="7d">{isOdia ? 'ଶେଷ ୭ ଦିନ' : 'Last 7d'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-40">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isOdia ? 'ସମସ୍ତ ସ୍ଥାନ' : 'All Locations'}</SelectItem>
                <SelectItem value="bhubaneswar">{isOdia ? 'ଭୁବନେଶ୍ୱର' : 'Bhubaneswar'}</SelectItem>
                <SelectItem value="cluster1">{isOdia ? 'କ୍ଲଷ୍ଟର ୧' : 'Cluster 1'}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {isOdia ? 'ସମୟ ତୁଳନା' : 'Compare Periods'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              {isOdia ? 'CSV ରପ୍ତାନି' : 'Export CSV'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {isOdia ? 'ସେୟାର' : 'Share'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Anomaly Alert Strip */}
        <Card className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="font-medium text-amber-400">{isOdia ? 'ଅସାମାନ୍ୟତା ଚିହ୍ନଟ' : 'Anomaly Detected'}</p>
                  <p className="text-sm text-muted-foreground">{isOdia ? 'J2 ରେ ହଠାତ୍ ଜାମ ବୃଦ୍ଧି — +40% ଅପେକ୍ଷା ସମୟ' : 'Sudden congestion spike at J2 — +40% wait time'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                {isOdia ? 'ଚେତାବନୀ ଖୋଲନ୍ତୁ' : 'Open Alert'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Top Junction Metrics */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart2 className="w-4 h-4" />
                  {isOdia ? 'ଶୀର୍ଷ ଜଙ୍କସନ ମେଟ୍ରିକ୍ସ' : 'Top Junction Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {junctions.map((junction) => {
                  const improvement = ((junction.wait_before - junction.wait_after) / junction.wait_before * 100);
                  const statusColor = improvement > 15 ? 'text-green-400' : improvement > 5 ? 'text-amber-400' : 'text-red-400';
                  const bgColor = improvement > 15 ? 'bg-green-500/10 border-green-500/20' : improvement > 5 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20';
                  
                  return (
                    <div key={junction.id} className={`p-3 rounded-lg border ${bgColor} hover:bg-opacity-20 transition-all cursor-pointer`} title={isOdia ? `${junction.name} - ${improvement.toFixed(1)}% ଉନ୍ନତି` : `${junction.name} - ${improvement.toFixed(1)}% improvement`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{junction.name}</h4>
                        <Badge variant="outline" className={`text-xs ${statusColor} border-current`}>
                          {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">{isOdia ? 'ଅପେକ୍ଷା:' : 'Wait:'}</span>
                          <span className="ml-1 font-medium">{junction.wait_after}s</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{isOdia ? 'ଥ୍ରୁପୁଟ:' : 'Throughput:'}</span>
                          <span className={`ml-1 font-medium ${junction.throughput_delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {junction.throughput_delta > 0 ? '+' : ''}{junction.throughput_delta}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 h-1 bg-muted/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${improvement > 15 ? 'bg-green-400' : improvement > 5 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${Math.min(Math.max(improvement, 0), 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Trend Graph & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enhanced Trend Graph */}
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {isOdia ? 'କାର୍ଯ୍ୟଦକ୍ଷତା ଧାରା' : 'Performance Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-secondary/20 rounded-lg relative overflow-hidden p-4">
                  <svg viewBox="0 0 300 120" className="w-full h-full">
                    <defs>
                      <linearGradient id="rlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Grid */}
                    {[...Array(4)].map((_, i) => (
                      <line key={i} x1="0" y1={i * 30} x2="300" y2={i * 30} stroke="hsl(var(--border))" strokeWidth="0.5"/>
                    ))}
                    
                    {/* Fixed Timer Line */}
                    <polyline
                      fill="none"
                      stroke="hsl(var(--destructive))"
                      strokeWidth="2"
                      points="0,80 60,85 120,90 180,88 240,92 300,90"
                    />
                    
                    {/* RL Engine Line */}
                    <polyline
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      points="0,80 60,75 120,65 180,60 240,55 300,50"
                    />
                    
                    {/* Fill under RL line */}
                    <polygon
                      fill="url(#rlGradient)"
                      points="0,80 60,75 120,65 180,60 240,55 300,50 300,120 0,120"
                    />
                  </svg>
                  
                  <div className="absolute top-4 right-4 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span>{isOdia ? 'ସ୍ଥିର ଟାଇମର' : 'Fixed Timer'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{isOdia ? 'RL ଇଞ୍ଜିନ' : 'RL Engine'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-center">
                  <Badge variant="default" className="bg-primary/20 text-primary">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {isOdia ? '22% ଅପେକ୍ଷା ହ୍ରାସ' : '22% Wait Reduction'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Alerts View Panel */}
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {isOdia ? 'ସାମ୍ପ୍ରତିକ ଚେତାବନୀ' : 'Recent Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 1, type: 'congestion', location: 'Master Canteen', severity: 'high', time: '2m', icon: '🚦' },
                  { id: 2, type: 'pothole', location: 'Jaydev Vihar', severity: 'medium', time: '5m', icon: '🕳️' },
                  { id: 3, type: 'violation', location: 'Kalinga Square', severity: 'low', time: '8m', icon: '⚠️' },
                  { id: 4, type: 'emergency', location: 'Fire Station Road', severity: 'critical', time: '12m', icon: '🚨' }
                ].map((alert) => {
                  const severityColors = {
                    critical: 'border-red-500/50 bg-red-500/10 text-red-300',
                    high: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
                    medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
                    low: 'border-green-500/50 bg-green-500/10 text-green-300'
                  };
                  
                  return (
                    <div key={alert.id} className={`p-2 rounded border ${severityColors[alert.severity as keyof typeof severityColors]} hover:bg-opacity-20 transition-all cursor-pointer`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{alert.icon}</span>
                          <div>
                            <p className="text-xs font-medium">{alert.location}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {isOdia ? 
                                (alert.type === 'congestion' ? 'ଜାମ' : 
                                 alert.type === 'pothole' ? 'ଗର୍ତ୍ତ' :
                                 alert.type === 'violation' ? 'ଉଲ୍ଲଂଘନ' : 'ଜରୁରୀ') 
                                : alert.type}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Segment Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  {isOdia ? 'ସେଗମେଣ୍ଟ ସମୀକ୍ଷା' : 'Segment Overview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'S1', name: 'NH-16 Corridor', congestion: 85, vehicles: 342, status: 'critical', lastUpdate: '1m' },
                    { id: 'S2', name: 'Bhubaneswar-Cuttack Road', congestion: 65, vehicles: 198, status: 'moderate', lastUpdate: '2m' },
                    { id: 'S3', name: 'Kalinga Hospital Road', congestion: 35, vehicles: 89, status: 'good', lastUpdate: '1m' },
                    { id: 'S4', name: 'Airport Road', congestion: 45, vehicles: 156, status: 'good', lastUpdate: '3m' },
                    { id: 'S5', name: 'Patia Square', congestion: 75, vehicles: 267, status: 'moderate', lastUpdate: '2m' }
                  ].map((segment) => {
                    const statusConfig = {
                      critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', dot: 'bg-red-400' },
                      moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
                      good: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', dot: 'bg-green-400' }
                    };
                    
                    const config = statusConfig[segment.status as keyof typeof statusConfig];
                    
                    return (
                      <div key={segment.id} className={`p-3 rounded-lg border ${config.bg} hover:bg-opacity-20 transition-all cursor-pointer`} title={`${segment.name} - ${segment.congestion}% ${isOdia ? 'ଜାମ' : 'congestion'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                            <h4 className="font-medium text-xs">{segment.name}</h4>
                          </div>
                          <span className="text-xs text-muted-foreground">{segment.lastUpdate}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{isOdia ? 'ଜାମ:' : 'Congestion:'}</span>
                            <span className={`font-medium ${config.color}`}>{segment.congestion}%</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{isOdia ? 'ଯାନବାହନ:' : 'Vehicles:'}</span>
                            <span className="font-medium">{segment.vehicles}</span>
                          </div>
                          
                          <div className="h-1 bg-muted/20 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${config.dot}`}
                              style={{ width: `${segment.congestion}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;