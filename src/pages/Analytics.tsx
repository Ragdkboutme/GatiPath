import { useState } from 'react';
import { BarChart2, TrendingUp, Clock, MapPin, Users, AlertTriangle, Activity, Zap, Download, Share2, Settings, ChevronDown, TrendingDown, Eye, Layers, Filter, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/dashboard/TopBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Main Area - Interactive Map (60% width) */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
{isOdia ? 'ଲାଇଭ ଟ୍ରାଫିକ ମାନଚିତ୍ର' : 'Live Traffic Map'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMapLayer('congestion')}
                      className={mapLayers.congestion ? 'bg-primary/20 border-primary/50' : ''}
                    >
                      <Layers className="w-4 h-4 mr-1" />
{isOdia ? 'ହିଟମାପ' : 'Heatmap'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMapLayer('sensors')}
                      className={mapLayers.sensors ? 'bg-primary/20 border-primary/50' : ''}
                    >
  IoT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMapLayer('cctv')}
                      className={mapLayers.cctv ? 'bg-primary/20 border-primary/50' : ''}
                    >
  CCTV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-slate-900 rounded-lg relative overflow-hidden">
                  {/* OSM Dark Style Map Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                    {/* Junction Markers */}
                    {junctions.map((junction, index) => (
                      <button
                        key={junction.id}
                        onClick={() => openJunctionModal(junction)}
                        className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform cursor-pointer"
                        style={{
                          left: `${20 + index * 25}%`,
                          top: `${30 + index * 15}%`
                        }}
                        title={junction.name}
                      />
                    ))}
                    
                    {/* Congestion Heatmap Overlay */}
                    {mapLayers.congestion && (
                      <div className="absolute inset-0 opacity-40">
                        <div className="absolute w-20 h-20 bg-red-500/60 rounded-full blur-xl" style={{left: '30%', top: '40%'}} />
                        <div className="absolute w-16 h-16 bg-amber-500/60 rounded-full blur-xl" style={{left: '60%', top: '25%'}} />
                        <div className="absolute w-12 h-12 bg-green-500/60 rounded-full blur-xl" style={{left: '45%', top: '65%'}} />
                      </div>
                    )}
                  </div>
                  
                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>{isOdia ? 'ଭାରୀ ଜାମ' : 'Heavy Congestion'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span>{isOdia ? 'ମଧ୍ୟମ ଟ୍ରାଫିକ' : 'Moderate Traffic'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>{isOdia ? 'ମୁକ୍ତ ପ୍ରବାହ' : 'Free Flow'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Range Scrubber */}
                  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span>{isOdia ? 'ସମୟ:' : 'Time:'}</span>
                      <div className="w-24 h-2 bg-muted rounded-full relative">
                        <div className="w-3 h-3 bg-primary rounded-full absolute -top-0.5 left-3/4"></div>
                      </div>
                      <span>{isOdia ? 'ବର୍ତ୍ତମାନ' : 'Now'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analytics Panels (40% width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Comparison */}
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart2 className="w-4 h-4" />
{isOdia ? 'କାର୍ଯ୍ୟଦକ୍ଷତା ତୁଳନା' : 'Performance Comparison'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart />
                <Badge variant="default" className="bg-primary/20 text-primary mt-3">
                  <TrendingDown className="w-3 h-3 mr-1" />
{isOdia ? '15% ସାମଗ୍ରିକ ଉନ୍ନତି' : '15% Overall Improvement'}
                </Badge>
              </CardContent>
            </Card>

            {/* Traffic Flow Analysis */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-panel border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{isOdia ? 'ସର୍ବୋତ୍ତମ ଜଙ୍କସନ' : 'Top Performing Junctions'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {junctions.slice(0, 3).map((junction) => (
                    <div key={junction.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <div>
                        <p className="text-sm font-medium">{junction.name}</p>
                        <p className="text-xs text-muted-foreground">{isOdia ? 'ଅପେକ୍ଷା:' : 'Wait:'} {junction.wait_after}s</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${junction.throughput_delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {junction.throughput_delta > 0 ? '+' : ''}{junction.throughput_delta}%
                        </p>
                        <p className="text-xs text-muted-foreground">{isOdia ? 'ଥ୍ରୁପୁଟ' : 'throughput'}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Incident Trends */}
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm">{isOdia ? 'ଘଟଣା ଧାରା (30d)' : 'Incident Trends (30d)'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/20 rounded-lg flex items-end justify-center gap-2 p-4">
                  {incidents_30d.map((day, index) => (
                    <div key={day.date} className="flex flex-col items-center gap-1">
                      <div className="w-4 space-y-0.5">
                        <div className="h-3 bg-red-500 rounded-sm" style={{height: `${day.potholes * 4}px`}}></div>
                        <div className="h-3 bg-amber-500 rounded-sm" style={{height: `${day.violations * 2}px`}}></div>
                        <div className="h-3 bg-blue-500 rounded-sm" style={{height: `${day.emergency * 8}px`}}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{index + 17}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded"></div>
                    <span>{isOdia ? 'ଗର୍ତ୍ତ' : 'Potholes'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded"></div>
                    <span>{isOdia ? 'ଉଲ୍ଲଂଘନ' : 'Violations'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded"></div>
                    <span>{isOdia ? 'ଜରୁରୀ' : 'Emergency'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RL Metrics */}
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm">{isOdia ? 'RL ଇଞ୍ଜିନ ମେଟ୍ରିକ୍ସ' : 'RL Engine Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/20" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeDasharray={`${rl_metrics.success_rate * 201} 201`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{Math.round(rl_metrics.success_rate * 100)}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{isOdia ? 'ଔସତ ବିଶ୍ୱାସ' : 'Avg Confidence'}</p>
                    <p className="text-sm font-bold">{Math.round(rl_metrics.avg_confidence * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{isOdia ? 'ହସ୍ତକ୍ଷେପ' : 'Interventions'}</p>
                    <p className="text-sm font-bold">{rl_metrics.interventions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Forecast */}
            <Card className="bg-gradient-panel border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm">{isOdia ? 'ଜାମ ପୂର୍ବାନୁମାନ' : 'Congestion Forecast'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">{isOdia ? 'ପରବର୍ତ୍ତୀ ଘଣ୍ଟା' : 'Next Hour'}</span>
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30">
{isOdia ? 'ମଧ୍ୟମ ବିପଦ' : 'Moderate Risk'}
                  </Badge>
                </div>
                <div className="h-8 bg-muted/20 rounded-lg flex items-center px-2">
                  <div className="flex-1 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full relative">
                    <div className="absolute w-2 h-2 bg-amber-400 rounded-full -top-0.5 left-2/3"></div>
                  </div>
                </div>
                <p className="text-lg font-bold text-amber-400 mt-2">{isOdia ? '65% ଜାମ' : '65% Congestion'}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Junction Modal */}
        {showJunctionModal && selectedJunction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-gradient-panel border-border/50 w-full max-w-2xl mx-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedJunction.name} Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowJunctionModal(false)}>
                    ✕
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedJunction.lat}, {selectedJunction.lon}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">24h Wait Time Chart (Sparkline)</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">Wait Before</p>
                    <p className="text-lg font-bold">{selectedJunction.wait_before}s</p>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">Wait After</p>
                    <p className="text-lg font-bold text-primary">{selectedJunction.wait_after}s</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Recent Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <span className="text-sm">Traffic spike detected</span>
                      <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">RL optimization applied</span>
                      <span className="text-xs text-muted-foreground ml-auto">12m ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    Drill Down
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;