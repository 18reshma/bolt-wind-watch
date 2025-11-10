import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { turbineData, getTurbineStatus } from "@/data/turbineData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Wind, Search, AlertCircle, CheckCircle, Users, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Mock admin credentials
const ADMIN_USERNAME = "admin";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user is admin
    if (user?.username !== ADMIN_USERNAME) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const filteredTurbines = turbineData.filter(turbine =>
    turbine.Turbine_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTurbines = turbineData.length;
  const atRiskCount = turbineData.filter(t => t.Fault_Probability > 0.6).length;
  const normalCount = totalTurbines - atRiskCount;
  const avgFaultProb = (turbineData.reduce((sum, t) => sum + t.Fault_Probability, 0) / totalTurbines * 100).toFixed(1);

  const getUserForTurbine = (turbineId: string) => {
    const users = [
      { username: "arjun", turbines: ["WT-01", "WT-03"] },
      { username: "megha", turbines: ["WT-02"] }
    ];
    return users.find(u => u.turbines.includes(turbineId))?.username || "Unassigned";
  };

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
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">System-wide Turbine Overview</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10">
              <Users className="mr-1 h-3 w-3" />
              Admin Access
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Total Turbines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{totalTurbines}</p>
            </CardContent>
          </Card>

          <Card className="border-success/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Operating Normally
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">{normalCount}</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">{atRiskCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Fault Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{avgFaultProb}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Turbines</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search turbines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turbine ID</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Oil Temp (°C)</TableHead>
                  <TableHead>Speed (RPM)</TableHead>
                  <TableHead>Fault Probability</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTurbines.map((turbine) => {
                  const { status, color } = getTurbineStatus(turbine.Fault_Probability);
                  const isAtRisk = turbine.Fault_Probability > 0.6;
                  
                  return (
                    <TableRow key={turbine.Turbine_ID} className={isAtRisk ? "bg-destructive/5" : ""}>
                      <TableCell className="font-medium">{turbine.Turbine_ID}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getUserForTurbine(turbine.Turbine_ID)}</Badge>
                      </TableCell>
                      <TableCell>{turbine.GearboxOilTemp.toFixed(1)}</TableCell>
                      <TableCell>{turbine.GeneratorSpeed}</TableCell>
                      <TableCell>
                        <span className={isAtRisk ? "text-destructive font-semibold" : "text-success font-semibold"}>
                          {(turbine.Fault_Probability * 100).toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isAtRisk ? "destructive" : "default"} className={
                          !isAtRisk ? "bg-success text-success-foreground" : ""
                        }>
                          {isAtRisk ? (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/turbine/${turbine.Turbine_ID}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredTurbines.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No turbines found matching "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
