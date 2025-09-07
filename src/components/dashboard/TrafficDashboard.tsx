import { TopBar } from "./TopBar";
import { KPIRibbon } from "./KPIRibbon";
import { LeftSidebar } from "./LeftSidebar";
import { MapHeatmap } from "./MapHeatmap";
import { RightColumn } from "./RightColumn";
import { BottomAnalytics } from "./BottomAnalytics";

export const TrafficDashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <TopBar />
      
      {/* KPI Ribbon */}
      <KPIRibbon />
      
      {/* Main Layout */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Center Map Area */}
        <div className="flex-1 p-4">
          <MapHeatmap />
        </div>
        
        {/* Right Column */}
        <RightColumn />
      </div>
      
      {/* Bottom Analytics */}
      <BottomAnalytics />
      
      {/* Footer */}
      <div className="border-t border-border px-6 py-3">
        <p className="text-xs text-muted-foreground">
          For operators only — raw CCTV access disabled; aggregated feeds only
        </p>
      </div>
    </div>
  );
};