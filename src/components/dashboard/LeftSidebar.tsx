import { Search, ChevronDown, Clock, Video, Satellite, Cpu, Power, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const LeftSidebar = () => {
  return (
    <div className="w-64 bg-card border-r border-border p-4 space-y-4">
      {/* Region Selector */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Region Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <div className="pl-10 pr-10 py-2 bg-secondary rounded-md border border-border cursor-pointer flex items-center justify-between">
              <span className="text-sm text-foreground">Junction Cluster 12</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Range Picker */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="default" size="sm" className="text-xs">Live</Button>
            <Button variant="outline" size="sm" className="text-xs">1h</Button>
            <Button variant="outline" size="sm" className="text-xs">4h</Button>
            <Button variant="outline" size="sm" className="text-xs">24h</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">CCTV</span>
              <Badge variant="default" className="h-2 w-2 p-0 bg-flow-good rounded-full"></Badge>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">GPS</span>
              <Badge variant="default" className="h-2 w-2 p-0 bg-flow-good rounded-full"></Badge>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">IoT</span>
              <Badge variant="default" className="h-2 w-2 p-0 bg-flow-medium rounded-full"></Badge>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Manual Controls */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Manual Override</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="destructive" size="sm" className="w-full justify-start gap-2">
            <Power className="w-4 h-4" />
            Emergency Override
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Shadow Mode</span>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};