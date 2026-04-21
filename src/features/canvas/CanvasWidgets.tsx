import React, { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/charts/echart";

interface SensorProps {
  initialValue?: number;
  isSimulated?: boolean;
}

export const TemperatureSensorWidget = ({
  initialValue = 25,
  isSimulated = true,
}: SensorProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (!isSimulated) {
      return;
    }

    const interval = setInterval(() => {
      const randomChange = Math.random() * 4 - 2;
      setValue((prev) => parseFloat((prev + randomChange).toFixed(1)));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulated]);

  const gaugeOption = useMemo(
    () => ({
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 60,
          radius: "100%",
          center: ["50%", "72%"],
          pointer: {
            icon: "circle",
            width: 12,
            length: "45%",
            offsetCenter: [0, "-60%"],
            itemStyle: { color: "#2563eb" },
          },
          progress: {
            show: true,
            width: 12,
            roundCap: true,
            itemStyle: { color: "#2563eb" },
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.25, "#5BE12C"],
                [0.5, "#F5CD19"],
                [0.75, "#EA4228"],
                [1, "#EA4228"],
              ],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, "-2%"],
            fontSize: 16,
            color: "#1f2937",
            formatter: (current: number) => `${current.toFixed(1)} C`,
          },
          data: [{ value }],
        },
      ],
    }),
    [value],
  );

  return (
    <div className="flex h-full w-full flex-col items-center rounded-lg border bg-white p-2 shadow-sm">
      <span className="mb-1 text-xs font-bold text-gray-500">Temperature</span>

      <div className="h-24 w-full">
        <EChart option={gaugeOption} height="100%" />
      </div>

      <div className="mt-1 text-xs text-gray-400">
        {isSimulated ? "Live (Simulated)" : "Offline"}
      </div>
    </div>
  );
};
