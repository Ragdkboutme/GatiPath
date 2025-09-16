import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LeftSidebar } from "./LeftSidebar";
import { RightColumn } from "./RightColumn";

interface MobileDrawerProps {
  isOdia: boolean;
  onLanguageChange: (value: boolean) => void;
  onTimeRangeChange: (value: string) => void;
}

export const MobileDrawer = ({ isOdia, onLanguageChange, onTimeRangeChange }: MobileDrawerProps) => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-between gap-4">
      {/* Left Sidebar Drawer */}
      <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-primary/90 backdrop-blur-sm shadow-lg"
          >
            <Menu className="w-4 h-4 mr-2" />
            {isOdia ? "ନିୟନ୍ত୍ରଣ" : "Controls"}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="h-full overflow-y-auto">
            <LeftSidebar 
              onLanguageChange={onLanguageChange}
              onTimeRangeChange={onTimeRangeChange}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Right Column Drawer */}
      <Sheet open={rightOpen} onOpenChange={setRightOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-primary/90 backdrop-blur-sm shadow-lg"
          >
            <Menu className="w-4 h-4 mr-2" />
            {isOdia ? "CCTV ଏବଂ ତଥ୍ୟ" : "CCTV & Data"}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="h-full overflow-y-auto">
            <RightColumn isOdia={isOdia} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
