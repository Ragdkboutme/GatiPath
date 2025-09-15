import { TopBar } from "./TopBar";
import { KPIRibbon } from "./KPIRibbon";
import { LeftSidebar } from "./LeftSidebar";
import { InteractiveMap } from "./InteractiveMap";
import { RightColumn } from "./RightColumn";
import { BottomAnalytics } from "./BottomAnalytics";
import { useState, useCallback } from "react";

export const TrafficDashboard = () => {
  const [isOdia, setIsOdia] = useState(false);
  
  const handleLanguageChange = useCallback((value: boolean) => {
    setIsOdia(value);
  }, []);
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Bar */}
      <TopBar isOdia={isOdia} setIsOdia={setIsOdia} />
      
      {/* KPI Ribbon */}
      <KPIRibbon isOdia={isOdia} />
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Sidebar - Hidden on mobile, shown on tablet and up */}
        <div className="hidden md:block">
          <LeftSidebar onLanguageChange={handleLanguageChange} />
        </div>

        {/* Center Map Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <InteractiveMap isOdia={isOdia} />
          </div>
          <div className="h-[40%] md:h-[40%] overflow-auto">
            <BottomAnalytics isOdia={isOdia} />
          </div>
        </div>

        {/* Right Column - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <RightColumn isOdia={isOdia} />
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