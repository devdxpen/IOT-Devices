"use client";

import React, { useState, useEffect, useRef } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertTriangle, MoreHorizontal } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import gsap from "gsap";

type AlertItem = {
  id: string;
  message: string;
  severity: "critical" | "warning" | "info";
};

const initialAlerts: AlertItem[] = [
  {
    id: "1",
    message: "High Electricity Spike Detected",
    severity: "critical",
  },
  {
    id: "2",
    message: "Water Flow Anomaly in Cooling Unit",
    severity: "warning",
  },
  {
    id: "3",
    message: "Gas Leak Risk Identified",
    severity: "info",
  },
];

export function AlertsWidget({ id }: NodeProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const cardRef = useRef<HTMLDivElement>(null);
  const alertRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animate on mount
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }

    // Stagger animate alerts
    alertRefs.current.forEach((ref, i) => {
      if (ref) {
        gsap.fromTo(
          ref,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            delay: i * 0.1,
            ease: "power2.out",
          },
        );
      }
    });
  }, []);

  const getSeverityStyles = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-600",
          icon: "text-red-500",
          label: "Critical",
        };
      case "warning":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-600",
          icon: "text-orange-500",
          label: "Warning",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-600",
          icon: "text-blue-500",
          label: "Info",
        };
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          ref={cardRef}
          className="w-72 p-4 shadow-lg border border-gray-100 bg-white"
        >

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gray-600" />
              <span className="font-semibold text-gray-900">
                Automation Alerts
              </span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const styles = getSeverityStyles(alert.severity);
              return (
                <div
                  key={alert.id}
                  ref={(el) => {
                    alertRefs.current[index] = el;
                  }}
                  className={`p-3 rounded-lg ${styles.bg} border ${styles.border}`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      size={16}
                      className={`${styles.icon} mt-0.5 flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {alert.message}
                      </p>
                      <span className={`text-xs ${styles.text} font-medium`}>
                        {styles.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-gray-400 mt-3 text-center">
            ID: {id.slice(0, 8)}
          </div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>View All Alerts</ContextMenuItem>
        <ContextMenuItem>Configure Alerts</ContextMenuItem>
        <ContextMenuItem>Clear All</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
