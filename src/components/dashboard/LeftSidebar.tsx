import { Search, ChevronDown, Clock, Video, Satellite, Cpu, Power, Play, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const LeftSidebar = ({ onLanguageChange, onTimeRangeChange, isOdia = false }: { 
  onLanguageChange?: (isOdia: boolean) => void,
  onTimeRangeChange?: (timeRange: string) => void,
  isOdia?: boolean
}) => {
  const [localIsOdia, setLocalIsOdia] = useState(isOdia);
  const [timeRange, setTimeRange] = useState<"live" | "1h" | "4h" | "24h">("live");
  
  // Update parent component when time range changes
  const handleTimeRangeChange = (newTimeRange: "live" | "1h" | "4h" | "24h") => {
    setTimeRange(newTimeRange);
    if (onTimeRangeChange) {
      onTimeRangeChange(newTimeRange);
    }
  };
  return (
    <div className="w-64 border-r border-border bg-gradient-panel p-4 flex flex-col gap-6 h-full overflow-y-auto">
      {/* Region Selector */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">{isOdia ? 'ଅଞ୍ଚଳ ନିୟନ୍ତ୍ରଣ' : 'Region Control'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground z-10" />
            <Select defaultValue="junction-12">
              <SelectTrigger className="pl-10 pr-10 py-2 bg-secondary rounded-md border border-border">
                <SelectValue placeholder={isOdia ? 'ଜଙ୍କସନ ବାଛନ୍ତୁ' : 'Select Junction'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{isOdia ? 'ଜଙ୍କସନ କ୍ଲଷ୍ଟର' : 'Junction Clusters'}</SelectLabel>
                  <SelectItem value="junction-12">{isOdia ? 'ଜଙ୍କସନ କ୍ଲଷ୍ଟର ୧୨' : 'Junction Cluster 12'}</SelectItem>
                  <SelectItem value="junction-8">{isOdia ? 'ଜଙ୍କସନ କ୍ଲଷ୍ଟର ୮' : 'Junction Cluster 8'}</SelectItem>
                  <SelectItem value="junction-15">{isOdia ? 'ଜଙ୍କସନ କ୍ଲଷ୍ଟର ୧୫' : 'Junction Cluster 15'}</SelectItem>
                  <SelectItem value="junction-23">{isOdia ? 'ଜଙ୍କସନ କ୍ଲଷ୍ଟର ୨୩' : 'Junction Cluster 23'}</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>{isOdia ? 'ବ୍ୟକ୍ତିଗତ ଜଙ୍କସନ' : 'Individual Junctions'}</SelectLabel>
                  <SelectItem value="jaydev-vihar">{isOdia ? 'ଜୟଦେବ ବିହାର' : 'Jaydev Vihar'}</SelectItem>
                  <SelectItem value="patia-square">{isOdia ? 'ପାଟିଆ ସ୍କୱାର' : 'Patia Square'}</SelectItem>
                  <SelectItem value="nandankanan-road">{isOdia ? 'ନନ୍ଦନକାନନ ରୋଡ' : 'Nandankanan Road'}</SelectItem>
                  <SelectItem value="acharya-vihar">{isOdia ? 'ଆଚାର୍ଯ୍ୟ ବିହାର' : 'Acharya Vihar'}</SelectItem>
                  <SelectItem value="rasulgarh-square">{isOdia ? 'ରସୁଲଗଡ଼ ସ୍କୱାର' : 'Rasulgarh Square'}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Time Range Picker */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {isOdia ? 'ସମୟ ସୀମା' : 'Time Range'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={timeRange === "live" ? "default" : "outline"} 
              size="sm" 
              className="text-xs"
              onClick={() => handleTimeRangeChange("live")}
            >
              {isOdia ? 'ଲାଇଭ' : 'Live'}
            </Button>
            <Button 
              variant={timeRange === "1h" ? "default" : "outline"} 
              size="sm" 
              className="text-xs"
              onClick={() => handleTimeRangeChange("1h")}
            >
              1h
            </Button>
            <Button 
              variant={timeRange === "4h" ? "default" : "outline"} 
              size="sm" 
              className="text-xs"
              onClick={() => handleTimeRangeChange("4h")}
            >
              4h
            </Button>
            <Button 
              variant={timeRange === "24h" ? "default" : "outline"} 
              size="sm" 
              className="text-xs"
              onClick={() => handleTimeRangeChange("24h")}
            >
              24h
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">{isOdia ? 'ଡାଟା ଉତ୍ସ' : 'Data Sources'}</CardTitle>
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
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
            {localIsOdia ? "ମାନୁଆଲ ଓଭରାଇଡ" : "Manual Override"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="destructive" size="sm" className="w-full justify-start gap-2 text-xs px-3 py-2 h-auto min-h-[32px] overflow-hidden">
            <Power className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {localIsOdia ? "ଜରୁରୀକାଳୀନ ଓଭରାଇଡ" : "Emergency Override"}
            </span>
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {localIsOdia ? "ଛାୟା ମୋଡ" : "Shadow Mode"}
              </span>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      {/* Language Selector */}
      <Card className="bg-gradient-panel border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Languages className="w-4 h-4" />
            {localIsOdia ? "ଭାଷା" : "Language"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">
                {localIsOdia ? "ଓଡ଼ିଆ" : "Odia"}
              </span>
            </div>
            <Switch 
              checked={localIsOdia} 
              onCheckedChange={(checked) => {
                setLocalIsOdia(checked);
                if (onLanguageChange) {
                  onLanguageChange(checked);
                }
              }} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};