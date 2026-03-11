"use client";
import React, { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Menu, ChevronDown } from "lucide-react";

const menuItems = ["Dashboard", "Settings", "Reports", "Logs"];

export const MenuButtonWidget = memo(function MenuButtonWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-[170px] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Menu size={14} className="text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">
            {(d.label as string) || "Menu"}
          </span>
        </div>
        <ChevronDown
          size={12}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-gray-100">
          {menuItems.map((item) => (
            <button
              key={item}
              className="w-full text-left px-4 py-2 text-[11px] text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
