import { Clock, MapPin, User, Wifi, Activity, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const TopBar = ({ isOdia, setIsOdia }: { 
  isOdia: boolean; 
  setIsOdia: (value: boolean) => void; 
}) => {
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  const translations = {
    title: isOdia ? "ଟ୍ରାଫିକ୍ ସଂଚାଳନ ପ୍ୟାନେଲ" : "Traffic Operations Dashboard",
    region: isOdia ? "ଭୁବନେଶ୍ୱର — ସଂଯୋଗ କ୍ଲଷ୍ଟର 12" : "Bhubaneswar — Junction Cluster 12",
    online: isOdia ? "ଅନଲାଇନ" : "Online",
    uptime: isOdia ? "ଅପଟାଇମ: 99.9%" : "Uptime: 99.9%"
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-panel">
      {/* Left - Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-flow rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">FlowSync</h1>
          <p className="text-sm text-muted-foreground">{translations.title}</p>
        </div>
      </div>

      {/* Center - Live Clock and Region */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-center">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-mono text-lg font-medium text-foreground">{currentTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{translations.region}</span>
        </div>
      </div>

      {/* Right - Language Toggle, User and Status */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOdia(!isOdia)}
          className="flex items-center gap-2 text-xs"
        >
          <Globe className="w-3 h-3" />
          {isOdia ? "ଓଡ଼ିଆ" : "EN"}
        </Button>
        <div className="flex gap-2">
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