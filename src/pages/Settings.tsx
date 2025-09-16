import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Eye, Shield, Database, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TopBar } from "@/components/dashboard/TopBar";

const Settings = () => {
  const [isOdia, setIsOdia] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <TopBar isOdia={isOdia} setIsOdia={setIsOdia} timeRange="live" />
      
      <div className="container mx-auto p-6">
        <Card className="bg-gradient-panel border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              {isOdia ? "ସେଟିଂସ" : "Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Appearance */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {isOdia ? "ଦେଖାଯିବା" : "Appearance"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>{isOdia ? "ଡାର୍କ ମୋଡ୍" : "Dark Mode"}</span>
                    <span className="text-xs text-muted-foreground">
                      {isOdia ? "ଡାର୍କ ଥିମ୍ ବ୍ୟବହାର କରନ୍ତୁ" : "Use dark theme"}
                    </span>
                  </Label>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Notifications */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {isOdia ? "ବିଜ୍ଞପ୍ତି" : "Notifications"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="alert-notifications" className="flex flex-col space-y-1">
                    <span>{isOdia ? "ଚେତାବନୀ ବିଜ୍ଞପ୍ତି" : "Alert Notifications"}</span>
                    <span className="text-xs text-muted-foreground">
                      {isOdia ? "ଗୁରୁତର ଚେତାବନୀ ପାଇଁ ବିଜ୍ଞପ୍ତି ପାଆନ୍ତୁ" : "Receive notifications for critical alerts"}
                    </span>
                  </Label>
                  <Switch id="alert-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-notifications" className="flex flex-col space-y-1">
                    <span>{isOdia ? "ସିଷ୍ଟମ୍ ବିଜ୍ଞପ୍ତି" : "System Notifications"}</span>
                    <span className="text-xs text-muted-foreground">
                      {isOdia ? "ସିଷ୍ଟମ୍ ଅପଡେଟ୍ ପାଇଁ ବିଜ୍ଞପ୍ତି ପାଆନ୍ତୁ" : "Receive notifications for system updates"}
                    </span>
                  </Label>
                  <Switch id="system-notifications" defaultChecked />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Privacy */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {isOdia ? "ଗୋପନୀୟତା" : "Privacy"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="blur-faces" className="flex flex-col space-y-1">
                    <span>{isOdia ? "ମୁହଁ ଧୂସର କରନ୍ତୁ" : "Blur Faces"}</span>
                    <span className="text-xs text-muted-foreground">
                      {isOdia ? "CCTV ଫୁଟେଜରେ ମୁହଁ ଧୂସର କରନ୍ତୁ" : "Blur faces in CCTV footage"}
                    </span>
                  </Label>
                  <Switch id="blur-faces" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="anonymize-data" className="flex flex-col space-y-1">
                    <span>{isOdia ? "ଡାଟା ଅଜ୍ଞାତ କରନ୍ତୁ" : "Anonymize Data"}</span>
                    <span className="text-xs text-muted-foreground">
                      {isOdia ? "ବ୍ୟକ୍ତିଗତ ଡାଟା ଅଜ୍ଞାତ କରନ୍ତୁ" : "Anonymize personal data"}
                    </span>
                  </Label>
                  <Switch id="anonymize-data" defaultChecked />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Data */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                {isOdia ? "ଡାଟା" : "Data"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-retention" className="flex flex-col space-y-1">
                    <span>{isOdia ? "ଡାଟା ଧାରଣ" : "Data Retention"}</span>
                    <span className="text-xs text-muted-foreground">
                      {isOdia ? "30 ଦିନ ପରେ ଡାଟା ଅଟୋମେଟିକ୍ ଭାବରେ ବିଲୋପ କରନ୍ତୁ" : "Automatically delete data after 30 days"}
                    </span>
                  </Label>
                  <Switch id="data-retention" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

export default Settings;