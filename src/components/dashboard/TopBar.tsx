import { Clock, MapPin, User, Wifi, Activity, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigation } from "./Navigation";

export const TopBar = ({ isOdia, setIsOdia, timeRange }: { 
  isOdia: boolean; 
  setIsOdia: (value: boolean) => void;
  timeRange: "live" | "1h" | "4h" | "24h";
}) => {
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  // Generate different metrics based on time range
  const getMetricsForTimeRange = () => {
    switch(timeRange) {
      case "1h":
        return {
          vehicleCount: "1,245",
          avgSpeed: "32 km/h",
          congestionLevel: "Medium"
        };
      case "4h":
        return {
          vehicleCount: "5,872",
          avgSpeed: "28 km/h",
          congestionLevel: "High"
        };
      case "24h":
        return {
          vehicleCount: "24,513",
          avgSpeed: "35 km/h",
          congestionLevel: "Low-Medium"
        };
      default: // live
        return {
          vehicleCount: "247",
          avgSpeed: "30 km/h",
          congestionLevel: "Medium"
        };
    }
  };

  const metrics = getMetricsForTimeRange();

  const translations = {
    title: isOdia ? "ଟ୍ରାଫିକ୍ ସଂଚାଳନ ପ୍ୟାନେଲ" : "Traffic Operations Dashboard",
    region: isOdia ? "ଭୁବନେଶ୍ୱର — ସଂଯୋଗ କ୍ଲଷ୍ଟର 12" : "Bhubaneswar — Junction Cluster 12",
    online: isOdia ? "ଅନଲାଇନ" : "Online",
    uptime: isOdia ? "ଅପଟାଇମ: 99.9%" : "Uptime: 99.9%",
    timeRangeLabel: isOdia ? "ସମୟ ସୀମା" : "Time Range",
    vehicleCount: isOdia ? `ଯାନ: ${metrics.vehicleCount}` : `Vehicles: ${metrics.vehicleCount}`,
    avgSpeed: isOdia ? `ଗତି: ${metrics.avgSpeed}` : `Avg Speed: ${metrics.avgSpeed}`,
    congestionLevel: isOdia ? `ଭିଡ଼: ${metrics.congestionLevel}` : `Congestion: ${metrics.congestionLevel}`
  };

  return (
    <header className="min-h-16 bg-card border-b border-border px-3 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between shadow-panel gap-3 md:gap-0">
      {/* Left - Logo and Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-8 h-8 bg-gradient-flow rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">GatiPath</h1>
          <p className="text-xs md:text-sm text-muted-foreground">{translations.title}</p>
        </div>
      </div>

      {/* Center - Live Clock, Region and Metrics */}
      <div className="flex flex-wrap items-center gap-3 md:gap-6 order-3 md:order-2">
        <div className="flex items-center gap-2 text-center">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-mono text-base md:text-lg font-medium text-foreground">{currentTime}</span>
          {timeRange !== "live" && (
            <Badge variant="outline" className="ml-1">
              {timeRange.toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 hidden md:flex">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{translations.region}</span>
        </div>
        
        {/* Metrics based on time range */}
        <div className="hidden md:flex items-center gap-4 ml-4 border-l border-border pl-4">
          <Badge variant="secondary" className="text-xs">
            {translations.vehicleCount}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {translations.avgSpeed}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {translations.congestionLevel}
          </Badge>
        </div>
      </div>

      {/* Center-Right - Navigation */}
      <div className="flex-1 flex justify-center order-2 md:order-3">
        <Navigation isOdia={isOdia} />
      </div>
      
      {/* Right - Language Toggle, User and Status */}
      <div className="flex items-center gap-2 md:gap-4 order-1 md:order-4 w-full md:w-auto justify-between md:justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOdia(!isOdia)}
          className="flex items-center gap-2 text-xs"
        >
          <Globe className="w-3 h-3" />
          {isOdia ? "ଓଡ଼ିଆ" : "EN"}
        </Button>
        <div className="flex gap-2 hidden md:flex">
          <Badge variant="default" className="bg-flow-good text-primary-foreground">
            <Wifi className="w-3 h-3 mr-1" />
            {translations.online}
          </Badge>
          <Badge variant="secondary" className="text-muted-foreground">
            {translations.uptime}
          </Badge>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted text-muted-foreground text-sm">OP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};