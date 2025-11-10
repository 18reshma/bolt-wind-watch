import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { turbineData } from "@/data/turbineData";
import TurbineCard from "@/components/TurbineCard";
import { Button } from "@/components/ui/button";
import { Wind, LogOut, AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check for at-risk turbines and show alerts
    const userTurbines = turbineData.filter(t => user?.turbines.includes(t.Turbine_ID));
    userTurbines.forEach(turbine => {
      if (turbine.Fault_Probability > 0.6) {
        toast.error(
          `⚠️ Turbine ${turbine.Turbine_ID} is at risk! Fault Probability = ${(turbine.Fault_Probability * 100).toFixed(0)}%`,
          {
            duration: 5000,
            icon: <AlertTriangle className="h-5 w-5" />,
          }
        );
      } else {
        toast.success(
          `✅ Turbine ${turbine.Turbine_ID} is operating normally.`,
          {
            duration: 3000,
          }
        );
      }
    });
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const userTurbines = turbineData.filter(t => user?.turbines.includes(t.Turbine_ID));
  const atRiskCount = userTurbines.filter(t => t.Fault_Probability > 0.6).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wind className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Wind Turbine Monitor</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {user?.username === "admin" && (
                <Button variant="outline" onClick={() => navigate("/admin")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg shadow-card border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Turbines</h3>
            <p className="text-3xl font-bold text-foreground mt-2">{userTurbines.length}</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-card border border-success/50">
            <h3 className="text-sm font-medium text-muted-foreground">Operating Normally</h3>
            <p className="text-3xl font-bold text-success mt-2">{userTurbines.length - atRiskCount}</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-card border border-destructive/50">
            <h3 className="text-sm font-medium text-muted-foreground">At Risk</h3>
            <p className="text-3xl font-bold text-destructive mt-2">{atRiskCount}</p>
          </div>
        </div>

        {/* Turbine Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Your Turbines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTurbines.map(turbine => (
              <TurbineCard key={turbine.Turbine_ID} turbine={turbine} />
            ))}
          </div>
        </div>

        {userTurbines.length === 0 && (
          <div className="text-center py-12">
            <Wind className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No turbines assigned to your account.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
