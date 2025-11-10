export interface TurbineData {
  Turbine_ID: string;
  GearboxOilTemp: number;
  GeneratorSpeed: number;
  Fault_Probability: number;
}

export const turbineData: TurbineData[] = [
  {
    Turbine_ID: "WT-01",
    GearboxOilTemp: 72.5,
    GeneratorSpeed: 1500,
    Fault_Probability: 0.72
  },
  {
    Turbine_ID: "WT-02",
    GearboxOilTemp: 68.2,
    GeneratorSpeed: 1498,
    Fault_Probability: 0.43
  },
  {
    Turbine_ID: "WT-03",
    GearboxOilTemp: 75.1,
    GeneratorSpeed: 1510,
    Fault_Probability: 0.81
  }
];

export const getTurbineStatus = (probability: number) => {
  return probability > 0.6 
    ? { status: "At Risk", color: "destructive" }
    : { status: "Normal", color: "success" };
};
