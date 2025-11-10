import { useState, useEffect, useCallback } from "react";
import { TurbineData } from "@/data/turbineData";

export const useRealTimeData = (initialData: TurbineData, updateInterval = 10000) => {
  const [currentData, setCurrentData] = useState<TurbineData>(initialData);
  const [isUpdating, setIsUpdating] = useState(true);

  const generateUpdate = useCallback(() => {
    setCurrentData(prev => {
      // Simulate realistic sensor variations
      const tempChange = (Math.random() - 0.5) * 2;
      const speedChange = Math.floor((Math.random() - 0.5) * 10);
      const probChange = (Math.random() - 0.5) * 0.05;

      return {
        ...prev,
        GearboxOilTemp: Math.max(60, Math.min(85, prev.GearboxOilTemp + tempChange)),
        GeneratorSpeed: Math.max(1480, Math.min(1520, prev.GeneratorSpeed + speedChange)),
        Fault_Probability: Math.max(0, Math.min(1, prev.Fault_Probability + probChange))
      };
    });
  }, []);

  useEffect(() => {
    if (!isUpdating) return;

    const interval = setInterval(() => {
      generateUpdate();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isUpdating, updateInterval, generateUpdate]);

  const toggleUpdates = () => setIsUpdating(prev => !prev);

  return { currentData, isUpdating, toggleUpdates };
};
