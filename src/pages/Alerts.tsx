import { useState } from 'react';
import { AlertTriangle, Filter, Clock, MapPin, CheckCircle, Bell, UserPlus, ChevronDown, ChevronRight, Ambulance, Car, Cloud, Zap, Eye, Settings, SortAsc, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/dashboard/TopBar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AlertData {
  id: string;
  time: string;
  type: 'pothole' | 'rl' | 'violation' | 'weather' | 'congestion' | 'emergency';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  coordinates?: string;
  description: string;
  recommendedAction?: string;
  confidence: number;
  source: string;
  status: 'active' | 'resolved' | 'assigned';
  assignedTo?: string;
}

const AlertStatistics = ({ isOdia = false }: { isOdia?: boolean }) => {
  const stats = {
    totalPotholes: 12,
    totalViolations: 30,
    avgRLConfidence: 88,
    activeAlerts: 8,
    resolvedToday: 24
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card className="bg-gradient-panel border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-xs text-muted-foreground">{isOdia ? 'ସକ୍ରିୟ ଚେତାବନୀ' : 'Active Alerts'}</p>
              <p className="text-lg font-bold text-destructive">{stats.activeAlerts}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-panel border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-muted-foreground">{isOdia ? 'ଆଜି ଗର୍ତ୍ତ' : 'Potholes Today'}</p>
              <p className="text-lg font-bold text-blue-400">{stats.totalPotholes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-panel border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">{isOdia ? 'ଉଲ୍ଲଂଘନ' : 'Violations'}</p>
              <p className="text-lg font-bold text-orange-400">{stats.totalViolations}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-panel border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div>
              <p className="text-xs text-muted-foreground">{isOdia ? 'RL ବିଶ୍ୱାସ' : 'RL Confidence'}</p>
              <p className="text-lg font-bold text-green-400">{stats.avgRLConfidence}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-panel border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">{isOdia ? 'ଆଜି ସମାଧାନ' : 'Resolved Today'}</p>
              <p className="text-lg font-bold text-green-500">{stats.resolvedToday}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FilterChips = ({ activeFilters, onFilterChange, isOdia = false }: { activeFilters: string[], onFilterChange: (filters: string[]) => void, isOdia?: boolean }) => {
  const filters = [
    { id: 'pothole', label: isOdia ? 'ଗର୍ତ୍ତ' : 'Pothole', icon: Car, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'rl', label: isOdia ? 'RL ଇଞ୍ଜିନ' : 'RL Engine', icon: Zap, color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    { id: 'violation', label: isOdia ? 'ଉଲ୍ଲଂଘନ' : 'Violation', icon: AlertTriangle, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { id: 'weather', label: isOdia ? 'ପାଣିପାଗ' : 'Weather', icon: Cloud, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { id: 'congestion', label: isOdia ? 'ଜାମ' : 'Congestion', icon: Car, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    { id: 'emergency', label: isOdia ? 'ଜରୁରୀ' : 'Emergency', icon: Ambulance, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
  ];

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(f => f !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilters.includes(filter.id);
        return (
          <Button
            key={filter.id}
            variant="outline"
            size="sm"
            onClick={() => toggleFilter(filter.id)}
            className={`${isActive ? filter.color : 'border-border/50 text-muted-foreground hover:text-foreground'} transition-all`}
          >
            <Icon className="w-3 h-3 mr-1" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};

const AlertCard = ({ alert, isExpanded, onToggleExpand, onAction, isOdia = false }: { 
  alert: AlertData, 
  isExpanded: boolean, 
  onToggleExpand: () => void,
  onAction: (action: string, alertId: string) => void,
  isOdia?: boolean
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pothole': return <Car className="w-4 h-4" />;
      case 'rl': return <Zap className="w-4 h-4" />;
      case 'violation': return <AlertTriangle className="w-4 h-4" />;
      case 'weather': return <Cloud className="w-4 h-4" />;
      case 'congestion': return <Car className="w-4 h-4" />;
      case 'emergency': return <Ambulance className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-300';
      case 'assigned': return 'bg-yellow-500/20 text-yellow-300';
      case 'resolved': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Card className="bg-gradient-panel border-border/50 hover:border-border transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(alert.type)}
                <span className="font-mono text-xs text-muted-foreground">{alert.time}</span>
              </div>
              <Badge className={getSeverityColor(alert.severity)}>
                {isOdia ? (alert.severity === 'critical' ? 'ଗମ୍ଭୀର' : alert.severity === 'high' ? 'ଉଚ୍ଚ' : alert.severity === 'medium' ? 'ମଧ୍ୟମ' : 'କମ୍') : alert.severity.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(alert.status)}>
                {isOdia ? (alert.status === 'active' ? 'ସକ୍ରିୟ' : alert.status === 'assigned' ? 'ନ୍ୟସ୍ତ' : 'ସମାଧାନ') : alert.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="mb-2">
              <h3 className="text-sm font-medium text-foreground mb-1">{alert.description}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{alert.location}</span>
                {alert.coordinates && <span className="text-xs">({alert.coordinates})</span>}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{isOdia ? 'ବିଶ୍ୱାସ:' : 'Confidence:'} {alert.confidence}%</span>
              </div>
              <div>
                {isOdia ? 'ଉତ୍ସ:' : 'Source:'} {alert.source}
              </div>
            </div>

            {alert.recommendedAction && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2 mb-3">
                <p className="text-xs text-blue-300">
                  <strong>{isOdia ? 'ସୁପାରିଶ:' : 'Recommended:'}</strong> {alert.recommendedAction}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction('resolve', alert.id)}
              className="text-green-400 hover:text-green-300"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction('notify', alert.id)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction('assign', alert.id)}
              className="text-orange-400 hover:text-orange-300"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">{isOdia ? 'ଅତିରିକ୍ତ ବିବରଣୀ' : 'Additional Details'}</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>{isOdia ? 'ଚେତାବନୀ ID:' : 'Alert ID:'} {alert.id}</div>
                  <div>{isOdia ? 'ଚିହ୍ନଟ ସମୟ:' : 'Detection Time:'} {alert.time}</div>
                  {alert.assignedTo && <div>{isOdia ? 'ନ୍ୟସ୍ତ:' : 'Assigned to:'} {alert.assignedTo}</div>}
                </div>
              </div>
              <div className="bg-secondary/20 rounded p-3">
                <div className="text-xs text-muted-foreground mb-2">{isOdia ? 'ଅବସ୍ଥାନ ପ୍ରାକଦର୍ଶନ' : 'Location Preview'}</div>
                <div className="h-24 bg-secondary/50 rounded flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-muted-foreground" />
                  <span className="ml-2 text-xs">{isOdia ? 'ମାନଚିତ୍ର ଦୃଶ୍ୟ' : 'Map View Placeholder'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EventsFeed = ({ alerts, expandedAlerts, onToggleExpand, onAction, isOdia = false }: { 
  alerts: AlertData[], 
  expandedAlerts: Set<string>, 
  onToggleExpand: (id: string) => void,
  onAction: (action: string, alertId: string) => void,
  isOdia?: boolean
}) => {

  return (
    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          isExpanded={expandedAlerts.has(alert.id)}
          onToggleExpand={() => onToggleExpand(alert.id)}
          onAction={onAction}
          isOdia={isOdia}
        />
      ))}
    </div>
  );
};

const Alerts = () => {
  const [isOdia, setIsOdia] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('timestamp');
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample alert data
  const alerts: AlertData[] = [
    {
      id: 'ALT-001',
      time: '08:45',
      type: 'emergency',
      severity: 'critical',
      location: 'Jaydev Vihar Junction',
      coordinates: '20.2961°N, 85.8245°E',
      description: 'Emergency vehicle (Ambulance) approaching - Route priority required',
      recommendedAction: 'Clear signal path for NS direction, ETA 2 minutes',
      confidence: 95,
      source: 'GPS Tracker + CCTV',
      status: 'active'
    },
    {
      id: 'ALT-002',
      time: '08:42',
      type: 'pothole',
      severity: 'high',
      location: 'Segment S-042',
      coordinates: '20.2955°N, 85.8240°E',
      description: 'Large pothole detected via IoT vibration sensor',
      recommendedAction: 'Dispatch maintenance crew within 4 hours',
      confidence: 87,
      source: 'IoT Sensor',
      status: 'active'
    },
    {
      id: 'ALT-003',
      time: '08:40',
      type: 'rl',
      severity: 'medium',
      location: 'Junction J1',
      description: 'RL Engine applied NS 25s timing adjustment',
      confidence: 89,
      source: 'RL Engine v1.2',
      status: 'resolved'
    },
    {
      id: 'ALT-004',
      time: '08:38',
      type: 'violation',
      severity: 'high',
      location: 'Patia Square',
      coordinates: '20.3010°N, 85.8350°E',
      description: 'Red-light violation detected - Vehicle ID: OD-05-AB-1234',
      recommendedAction: 'Issue automated fine, review CCTV footage',
      confidence: 92,
      source: 'YOLOv8 + CCTV',
      status: 'active'
    },
    {
      id: 'ALT-005',
      time: '08:35',
      type: 'weather',
      severity: 'medium',
      location: 'Multiple Segments',
      description: 'Heavy rain detected across 3 IoT sensors',
      recommendedAction: 'Increase signal cycle times by 10%',
      confidence: 78,
      source: 'Weather IoT Network',
      status: 'active'
    },
    {
      id: 'ALT-006',
      time: '08:32',
      type: 'congestion',
      severity: 'high',
      location: 'Segment S-041',
      coordinates: '20.2945°N, 85.8230°E',
      description: 'Traffic congestion spike detected - Queue length: 150m',
      recommendedAction: 'Adjust upstream signal timing, consider alternate routes',
      confidence: 84,
      source: 'CCTV Analytics',
      status: 'assigned',
      assignedTo: 'Traffic Control Team A'
    }
  ];

  const filteredAlerts = alerts.filter(alert => 
    activeFilters.length === 0 || activeFilters.includes(alert.type)
  );

  const handleToggleExpand = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const handleAction = (action: string, alertId: string) => {
    console.log(`Action: ${action} on alert: ${alertId}`);
    // Implement action logic here
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <TopBar isOdia={isOdia} setIsOdia={setIsOdia} timeRange="live" />
      
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Statistics Panel */}
          <AlertStatistics isOdia={isOdia} />
          
          {/* Filters and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <FilterChips activeFilters={activeFilters} onFilterChange={setActiveFilters} isOdia={isOdia} />
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={isOdia ? 'ସଜାଡ଼ନ୍ତୁ' : 'Sort by'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">{isOdia ? 'ସମୟ' : 'Timestamp'}</SelectItem>
                  <SelectItem value="severity">{isOdia ? 'ଗମ୍ଭୀରତା' : 'Severity'}</SelectItem>
                  <SelectItem value="confidence">{isOdia ? 'ବିଶ୍ୱାସ' : 'Confidence'}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isOdia ? 'ସେଟିଂସ' : 'Settings'}
              </Button>
            </div>
          </div>

          {/* Alerts Feed */}
          <Card className="bg-gradient-panel border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {isOdia ? "ଚେତାବନୀ ଏବଂ ଘଟଣା" : "Active Alerts & Events"}
                <Badge variant="destructive" className="ml-2">
                  {filteredAlerts.filter(a => a.status === 'active').length} {isOdia ? 'ସକ୍ରିୟ' : 'Active'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EventsFeed 
                alerts={filteredAlerts} 
                expandedAlerts={expandedAlerts}
                onToggleExpand={handleToggleExpand}
                onAction={handleAction}
                isOdia={isOdia}
              />
            </CardContent>
          </Card>
        </div>

        {/* Collapsible Right Sidebar */}
        <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <CollapsibleContent className="w-80 border-l border-border bg-gradient-panel p-4">
            <div className="space-y-6">
              {/* Map Integration */}
              <Card className="bg-gradient-panel border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {isOdia ? 'ଚେତାବନୀ ଅବସ୍ଥାନ' : 'Alert Locations'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-secondary/20 rounded flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">{isOdia ? 'ଇଣ୍ଟରାକ୍ଟିଭ ମାନଚିତ୍ର' : 'Interactive Map'}</p>
                      <p className="text-xs text-muted-foreground">{isOdia ? 'ଅବସ୍ଥାନ ଦେଖିବାକୁ ଚେତାବନୀ କ୍ଲିକ୍ କରନ୍ତୁ' : 'Click alerts to view location'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-panel border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                    {isOdia ? 'ଶୀଘ୍ର କାର୍ଯ୍ୟ' : 'Quick Actions'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isOdia ? 'ସବୁ ସମାଧାନ ଚିହ୍ନିତ କରନ୍ତୁ' : 'Mark All Resolved'}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    {isOdia ? 'ବଲ୍କ ବିଜ୍ଞପ୍ତି ପଠାନ୍ତୁ' : 'Send Bulk Notification'}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {isOdia ? 'ରିପୋର୍ଟ ରପ୍ତାନି କରନ୍ତୁ' : 'Export Report'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>
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