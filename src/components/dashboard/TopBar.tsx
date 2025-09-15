import { Clock, MapPin, User, Wifi, Activity, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigation } from "./Navigation";

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
    <header className="min-h-16 bg-card border-b border-border px-3 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between shadow-panel gap-3 md:gap-0">
      {/* Left - Logo and Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-8 h-8 bg-gradient-flow rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">FlowSync</h1>
          <p className="text-xs md:text-sm text-muted-foreground">{translations.title}</p>
        </div>
      </div>

      {/* Center - Live Clock and Region */}
      <div className="flex flex-wrap items-center gap-3 md:gap-6 order-3 md:order-2">
        <div className="flex items-center gap-2 text-center">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-mono text-base md:text-lg font-medium text-foreground">{currentTime}</span>
        </div>
        <div className="flex items-center gap-2 hidden md:flex">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{translations.region}</span>
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