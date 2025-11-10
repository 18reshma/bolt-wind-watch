import { TurbineData } from "./turbineData";

export interface TurbineHistoryEntry extends TurbineData {
  timestamp: string;
}

// Generate historical data for the last 24 hours
export const generateHistoricalData = (turbineId: string): TurbineHistoryEntry[] => {
  const history: TurbineHistoryEntry[] = [];
  const now = new Date();
  
  // Base values for each turbine
  const baseValues: Record<string, { temp: number; speed: number; prob: number }> = {
    "WT-01": { temp: 72.5, speed: 1500, prob: 0.72 },
    "WT-02": { temp: 68.2, speed: 1498, prob: 0.43 },
    "WT-03": { temp: 75.1, speed: 1510, prob: 0.81 }
  };

  const base = baseValues[turbineId] || baseValues["WT-01"];

  // Generate data points for last 24 hours (every 30 minutes = 48 points)
  for (let i = 48; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    
    // Add some variation to make it realistic
    const tempVariation = (Math.random() - 0.5) * 5;
    const speedVariation = Math.floor((Math.random() - 0.5) * 20);
    const probVariation = (Math.random() - 0.5) * 0.15;

    history.push({
      Turbine_ID: turbineId,
      GearboxOilTemp: Math.max(60, Math.min(85, base.temp + tempVariation)),
      GeneratorSpeed: Math.max(1480, Math.min(1520, base.speed + speedVariation)),
      Fault_Probability: Math.max(0, Math.min(1, base.prob + probVariation)),
      timestamp: timestamp.toISOString()
    });
  }

  return history;
};
