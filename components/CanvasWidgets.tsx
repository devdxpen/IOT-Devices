// components/CanvasWidgets.tsx
import React, { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";

interface SensorProps {
  initialValue?: number;
  isSimulated?: boolean; // "Pre-use" mode mate
}

export const TemperatureSensorWidget = ({
  initialValue = 25,
  isSimulated = true,
}: SensorProps) => {
  const [value, setValue] = useState(initialValue);

  // Pre-use: Simulate data changes every 2 seconds
  useEffect(() => {
    if (!isSimulated) return;

    const interval = setInterval(() => {
      // Random temp between 20 and 40
      const randomChange = Math.random() * 4 - 2;
      setValue((prev) => parseFloat((prev + randomChange).toFixed(1)));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulated]);

  return (
    <div className="flex flex-col items-center p-2 bg-white border rounded-lg shadow-sm w-full h-full">
      <span className="text-xs font-bold text-gray-500 mb-1">Temperature</span>

      {/* Gauge Component */}
      <div className="w-full h-24">
        <GaugeComponent
          type="semicircle"
          arc={{
            width: 0.2,
            padding: 0.005,
            cornerRadius: 1,
            gradient: false,
            subArcs: [
              { limit: 15, color: "#5BE12C", showTick: true },
              { limit: 30, color: "#F5CD19", showTick: true },
              { limit: 45, color: "#EA4228", showTick: true },
              { color: "#EA4228" },
            ],
          }}
          pointer={{ type: "blob", animationDelay: 0 }}
          value={value}
          minValue={0}
          maxValue={60}
          labels={{
            valueLabel: { formatTextValue: (val) => val + "ºC" },
          }}
        />
      </div>

      <div className="text-xs text-gray-400 mt-1">
        {isSimulated ? "• Live (Simulated)" : "• Offline"}
      </div>
    </div>
  );
};
