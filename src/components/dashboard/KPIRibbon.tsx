import { TrendingDown, Gauge, Leaf, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const KPICard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  icon: Icon, 
  variant = "default" 
}: {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down";
  trendValue?: string;
  icon: any;
  variant?: "default" | "success" | "warning" | "danger";
}) => {
  const getTrendColor = () => {
    if (trend === "down") return "text-flow-good";
    if (trend === "up") return "text-flow-heavy";
    return "text-muted-foreground";
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "success": return "border-flow-good/20 shadow-glow-primary";
      case "warning": return "border-flow-medium/20 shadow-glow-warning";
      case "danger": return "border-flow-heavy/20 shadow-glow-danger";
      default: return "border-border";
    }
  };

  return (
    <Card className={`bg-gradient-panel ${getVariantStyles()} transition-smooth hover:scale-105`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-muted/20">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          {trendValue && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const KPIRibbon = ({ isOdia = false }) => {
  const translations = {
    avgCommute: isOdia ? "ଔସତ ଯାତ୍ରା ସମୟ" : "Avg commute time",
    congestionIndex: isOdia ? "ଜାମ ସୂଚକ" : "Congestion Index", 
    emissionsSaved: isOdia ? "ଆଜି ଉଦ୍ଗାସିତ କମିଲା" : "Emissions Saved Today",
    alertsActive: isOdia ? "ସକ୍ରିୟ ଅଲର୍ଟ" : "Alerts Active"
  };
  return (
    <div className="p-6 border-b border-border">
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title={translations.avgCommute}
          value={isOdia ? "34 ମିନିଟ" : "34"}
          unit={isOdia ? "" : "min"}
          trend="down"
          trendValue="-10%"
          icon={TrendingDown}
          variant="success"
        />
        <KPICard
          title={translations.congestionIndex}
          value="28%"
          icon={Gauge}
          variant="warning"
        />
        <KPICard
          title={translations.emissionsSaved}
          value={isOdia ? "125 କେଜି CO₂" : "125"}
          unit={isOdia ? "" : "kg CO₂"}
          icon={Leaf}
          variant="success"
        />
        <KPICard
          title={translations.alertsActive}
          value={3}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>
    </div>
  );
};