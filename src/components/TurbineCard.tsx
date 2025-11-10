import { AlertCircle, CheckCircle, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TurbineData, getTurbineStatus } from "@/data/turbineData";

interface TurbineCardProps {
  turbine: TurbineData;
}

const TurbineCard = ({ turbine }: TurbineCardProps) => {
  const { status, color } = getTurbineStatus(turbine.Fault_Probability);
  const isAtRisk = turbine.Fault_Probability > 0.6;

  return (
    <Card className={`transition-all duration-300 hover:shadow-elevated ${
      isAtRisk ? 'border-destructive/50 bg-destructive/5' : 'border-success/50 bg-success/5'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" />
          {turbine.Turbine_ID}
        </CardTitle>
        <Badge variant={isAtRisk ? "destructive" : "default"} className={
          !isAtRisk ? "bg-success text-success-foreground hover:bg-success/90" : ""
        }>
          {isAtRisk ? (
            <AlertCircle className="mr-1 h-3 w-3" />
          ) : (
            <CheckCircle className="mr-1 h-3 w-3" />
          )}
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Gearbox Oil Temp</span>
            <span className="font-semibold">{turbine.GearboxOilTemp}°C</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Generator Speed</span>
            <span className="font-semibold">{turbine.GeneratorSpeed} RPM</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Fault Probability</span>
            <span className={`text-lg font-bold ${
              isAtRisk ? 'text-destructive' : 'text-success'
            }`}>
              {(turbine.Fault_Probability * 100).toFixed(0)}%
            </span>
          </div>
          {isAtRisk && (
            <div className="mt-3 p-2 bg-destructive/10 rounded-md">
              <p className="text-xs text-destructive font-medium">
                ⚠️ Maintenance recommended - High fault risk detected
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TurbineCard;
