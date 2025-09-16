import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Tooltip } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { ZoomIn, ZoomOut, Layers, Navigation, Route, CheckCircle, AlertTriangle, Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import { toast } from '@/components/ui/use-toast';
import { ErrorBoundary } from 'react-error-boundary';

// Default coordinates for Bhubaneswar, India
const DEFAULT_CENTER: LatLngExpression = [20.2961, 85.8245];
const DEFAULT_ZOOM = 13;

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Map Control Component
const MapControls = () => {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      <Card className="bg-card/90 backdrop-blur border-border/50">
        <CardContent className="p-2 flex gap-1">
          <Button variant="ghost" size="sm" className="p-2" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Navigation className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Route className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Layers className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Legend Component
const MapLegend = ({ isOdia = false }: { isOdia?: boolean }) => {
  const translations = {
    vehiclesSegment: isOdia ? "ଯାନବାହନ / ବିଭାଗ" : "Vehicles / Segment",
  };
  
  return (
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
  );
};

// Junction Info Component
const JunctionInfo = ({ isOdia = false }: { isOdia?: boolean }) => {
  const translations = {
    mainRoute: isOdia ? "ମୁଖ୍ୟ ପଥ" : "Main Route",
    altRoute: isOdia ? "ବିକଳ୍ପ ପଥ" : "Alt Route",
    heavy: isOdia ? "ଭାରୀ" : "Heavy",
    applyAdvisory: isOdia ? "ପରାମର୍ଶ ଲାଗୁ କରନ୍ତୁ" : "Apply Advisory"
  };
  
  return (
    <div className="absolute top-1/2 left-1/3 z-10">
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
  );
};

// Main Interactive Map Component
export const InteractiveMap = ({ isOdia = false, timeRange = "live" }: { isOdia?: boolean; timeRange?: "live" | "1h" | "4h" | "24h" }) => {
  const [selectedJunction, setSelectedJunction] = useState<number | null>(null);
  const [showLiveOverlay, setShowLiveOverlay] = useState(timeRange === "live");
  
  // Update live overlay when timeRange changes
  useEffect(() => {
    setShowLiveOverlay(timeRange === "live");
  }, [timeRange]);
  
  // Sample junction data
  const junctions = [
    {
      id: 1,
      position: [20.296059, 85.824539] as LatLngExpression,
      name: 'Jaydev Vihar',
      nameOdia: 'ଜୟଦେବ ବିହାର',
      status: 'normal',
      congestion: 'low',
      cameras: 4,
      vehicleCount: 42,
      avgSpeed: 35,
      incidents: [],
      lastUpdated: '2 min ago'
    },
    {
      id: 2,
      position: [20.305659, 85.833339] as LatLngExpression,
      name: 'Nandankanan Road',
      nameOdia: 'ନନ୍ଦନକାନନ ରୋଡ',
      status: 'warning',
      congestion: 'medium',
      cameras: 3,
      vehicleCount: 78,
      avgSpeed: 22,
      incidents: ['Signal malfunction'],
      lastUpdated: '1 min ago'
    },
    {
      id: 3,
      position: [20.288059, 85.844539] as LatLngExpression,
      name: 'Patia Square',
      nameOdia: 'ପାଟିଆ ସ୍କୱାର',
      status: 'alert',
      congestion: 'high',
      cameras: 5,
      vehicleCount: 124,
      avgSpeed: 12,
      incidents: ['Accident reported', 'Heavy congestion'],
      lastUpdated: 'Just now'
    },
    {
      id: 4,
      position: [20.301059, 85.814539] as LatLngExpression,
      name: 'Acharya Vihar',
      nameOdia: 'ଆଚାର୍ଯ୍ୟ ବିହାର',
      status: 'normal',
      congestion: 'medium',
      cameras: 3,
      vehicleCount: 65,
      avgSpeed: 28,
      incidents: [],
      lastUpdated: '5 min ago'
    },
    {
      id: 5,
      position: [20.278059, 85.834539] as LatLngExpression,
      name: 'Rasulgarh Square',
      nameOdia: 'ରସୁଲଗଡ଼ ସ୍କୱାର',
      status: 'warning',
      congestion: 'medium',
      cameras: 4,
      vehicleCount: 92,
      avgSpeed: 18,
      incidents: ['Road work'],
      lastUpdated: '3 min ago'
    },
  ];
  
  // Function to handle alert notification
  const showAlert = useCallback((junction: any) => {
    if (junction.incidents.length > 0) {
      toast({
        title: `Alert at ${junction.name}`,
        description: junction.incidents.join(', '),
        variant: 'destructive',
      });
    }
  }, []);

  // Function to get marker icon based on congestion
  const getMarkerIcon = (congestion: string) => {
    return customIcon;
  };

  // Function to get congestion color
  const getCongestionColor = (congestion: string) => {
    switch (congestion) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'blue';
    }
  };

  // Fallback component for map errors
  const MapErrorFallback = () => (
    <div className="flex items-center justify-center h-full w-full bg-muted p-4 text-center">
      <div>
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
        <h3 className="font-medium text-lg mb-1">Map could not be loaded</h3>
        <p className="text-sm text-muted-foreground mb-4">There was an issue loading the interactive map</p>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          Reload page
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 relative bg-card rounded-lg border border-border overflow-hidden h-full">
      <ErrorBoundary FallbackComponent={MapErrorFallback}>
        <MapContainer 
          center={DEFAULT_CENTER} 
          zoom={DEFAULT_ZOOM} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          key="map-container"
        >
        {/* Clean white/light style map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Live Data Overlay */}
        {showLiveOverlay && (
          <div className="absolute top-0 left-0 right-0 bg-primary/90 text-primary-foreground py-1 px-4 flex items-center justify-between z-[1000]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-medium">
                {isOdia ? "ଲାଇଭ୍ ଡାଟା" : "Live Data"}
              </span>
            </div>
            <Badge variant="outline" className="text-xs border-primary-foreground/30 text-primary-foreground">
              {isOdia ? "ରିଅଲ-ଟାଇମ୍ ଅପଡେଟ୍" : "Real-time updates"}
            </Badge>
          </div>
        )}
        
        {/* Junction markers with enhanced functionality */}
        {junctions.map((junction) => (
          <React.Fragment key={junction.id}>
            {/* Congestion Circle */}
            <Circle 
              center={junction.position}
              radius={200}
              pathOptions={{ 
                fillColor: getCongestionColor(junction.congestion),
                fillOpacity: 0.2,
                color: getCongestionColor(junction.congestion),
                weight: 1
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                {junction.name} - {junction.congestion} traffic
              </Tooltip>
            </Circle>
            
            {/* Junction Marker */}
            <Marker 
              position={junction.position} 
              icon={getMarkerIcon(junction.congestion)}
              eventHandlers={{
                click: () => {
                  setSelectedJunction(junction.id);
                  if (junction.status === 'alert') {
                    showAlert(junction);
                  }
                },
              }}
            >
              <Popup className="custom-popup">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{isOdia ? junction.nameOdia : junction.name}</h3>
                      <Badge 
                        variant={junction.status === 'alert' ? 'destructive' : 
                                junction.status === 'warning' ? 'warning' : 'outline'}
                      >
                        {junction.status === 'alert' ? <AlertTriangle className="h-3 w-3 mr-1" /> : 
                         junction.status === 'warning' ? <AlertCircle className="h-3 w-3 mr-1" /> : null}
                        {junction.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Car className="h-3 w-3 text-muted-foreground" />
                        <span>{junction.vehicleCount} vehicles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-muted-foreground" />
                        <span>{junction.avgSpeed} km/h</span>
                      </div>
                    </div>
                    
                    {junction.incidents.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs font-medium mb-1">Incidents:</p>
                        <ul className="text-xs space-y-1">
                          {junction.incidents.map((incident: string, i: number) => (
                            <li key={i} className="flex items-start gap-1">
                              <AlertTriangle className="h-3 w-3 text-destructive mt-0.5" />
                              <span>{incident}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Updated: {junction.lastUpdated}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
        
        {/* Map Controls */}
        <MapControls />
      </MapContainer>
      </ErrorBoundary>
      
      {/* Legend */}
      <MapLegend isOdia={isOdia} />
      
      {/* Junction Info - Only show when a junction is selected */}
      {selectedJunction && <JunctionInfo isOdia={isOdia} />}
    </div>
  );
};