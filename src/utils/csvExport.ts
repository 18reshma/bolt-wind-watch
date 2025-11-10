import { TurbineData } from "@/data/turbineData";

export interface TurbineHistoryEntry extends TurbineData {
  timestamp: string;
}

export const exportTurbineDataToCSV = (
  turbineId: string,
  historyData: TurbineHistoryEntry[]
) => {
  // Create CSV header
  const headers = [
    "Timestamp",
    "Turbine ID",
    "Gearbox Oil Temp (°C)",
    "Generator Speed (RPM)",
    "Fault Probability (%)"
  ];

  // Create CSV rows
  const rows = historyData.map(entry => [
    entry.timestamp,
    entry.Turbine_ID,
    entry.GearboxOilTemp.toFixed(1),
    entry.GeneratorSpeed,
    (entry.Fault_Probability * 100).toFixed(2)
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${turbineId}_performance_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
