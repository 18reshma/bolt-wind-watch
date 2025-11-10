import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { turbineData } from "@/data/turbineData";
import { generateHistoricalData, TurbineHistoryEntry } from "@/data/turbineHistory";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { exportTurbineDataToCSV } from "@/utils/csvExport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Activity, Pause, Play, AlertCircle, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { toast } from "sonner";

const TurbineDetail = () => {
  const { turbineId } = useParams<{ turbineId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const turbine = turbineData.find(t => t.Turbine_ID === turbineId);
  const { currentData, isUpdating, toggleUpdates } = useRealTimeData(turbine!);
  const [history, setHistory] = useState<TurbineHistoryEntry[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!turbine) {
      toast.error("Turbine not found");
      navigate("/dashboard");
      return;
    }

    // Check if user has access to this turbine
    if (!user?.turbines.includes(turbineId!)) {
      toast.error("Access denied to this turbine");
      navigate("/dashboard");
      return;
    }

    // Load historical data
    setHistory(generateHistoricalData(turbineId!));
  }, [isAuthenticated, turbine, turbineId, user, navigate]);

  useEffect(() => {
    // Add current data to history every update
    if (currentData) {
      setHistory(prev => [
        ...prev.slice(-47), // Keep last 47 entries
        {
          ...currentData,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [currentData]);

  const handleExport = () => {
    exportTurbineDataToCSV(turbineId!, history);
    toast.success(`Performance data exported for ${turbineId}`);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = history.map(entry => ({
    time: formatTime(entry.timestamp),
    temperature: entry.GearboxOilTemp,
    speed: entry.GeneratorSpeed,
    probability: entry.Fault_Probability * 100
  }));

  const isAtRisk = currentData.Fault_Probability > 0.6;

  if (!turbine) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Turbine {turbineId}</h1>
                <p className="text-sm text-muted-foreground">Real-time Performance Monitoring</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={toggleUpdates}>
                {isUpdating ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Updates
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume Updates
                  </>
                )}
              </Button>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className={isAtRisk ? "border-destructive/50" : "border-success/50"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isAtRisk ? "destructive" : "default"} className={
                !isAtRisk ? "bg-success text-success-foreground" : ""
              }>
                {isAtRisk ? (
                  <AlertCircle className="mr-1 h-4 w-4" />
                ) : (
                  <CheckCircle className="mr-1 h-4 w-4" />
                )}
                {isAtRisk ? "At Risk" : "Normal"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gearbox Oil Temp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.GearboxOilTemp.toFixed(1)}°C</div>
              {isUpdating && <Activity className="h-4 w-4 text-primary animate-pulse mt-1" />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Generator Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.GeneratorSpeed} RPM</div>
              {isUpdating && <Activity className="h-4 w-4 text-primary animate-pulse mt-1" />}
            </CardContent>
          </Card>

          <Card className={isAtRisk ? "bg-destructive/5" : "bg-success/5"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fault Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isAtRisk ? "text-destructive" : "text-success"}`}>
                {(currentData.Fault_Probability * 100).toFixed(1)}%
              </div>
              {isUpdating && <Activity className="h-4 w-4 text-primary animate-pulse mt-1" />}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Fault Probability Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Fault Probability Trend (24 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="probability" 
                    stroke="hsl(var(--destructive))" 
                    fillOpacity={1}
                    fill="url(#colorProb)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Temperature and Speed */}
          <Card>
            <CardHeader>
              <CardTitle>Temperature & Speed Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Speed (RPM)', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    name="Temperature (°C)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="speed" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    dot={false}
                    name="Speed (RPM)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TurbineDetail;
