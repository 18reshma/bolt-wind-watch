import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wind, Activity, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">WindWatch AI</span>
            </div>
            <Button onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Wind className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Empowering Wind Energy with{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Real-Time Fault Prediction & Monitoring for Wind Turbines. 
              Detect issues before they become problems.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Advanced Monitoring Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive insights into your wind turbine operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-card border border-border hover:shadow-elevated transition-all">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Monitoring</h3>
              <p className="text-muted-foreground">
                Track gearbox temperature, generator speed, and fault probabilities in real-time
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-card border border-border hover:shadow-elevated transition-all">
              <div className="p-3 bg-destructive/10 rounded-lg w-fit mb-4">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Predictive Alerts</h3>
              <p className="text-muted-foreground">
                Get instant notifications when fault probability exceeds safe thresholds
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-card border border-border hover:shadow-elevated transition-all">
              <div className="p-3 bg-success/10 rounded-lg w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Performance Insights</h3>
              <p className="text-muted-foreground">
                Analyze trends and optimize maintenance schedules for maximum efficiency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-hero rounded-2xl p-12 shadow-elevated">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Optimize Your Wind Farm?
            </h2>
            <p className="text-primary-foreground/90 mb-8 text-lg">
              Join leading energy companies using AI-powered monitoring
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/login")}
              className="text-lg px-8"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">WindWatch AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 WindWatch AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
