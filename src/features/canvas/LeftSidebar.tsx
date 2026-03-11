"use client";

import { cn } from "@/lib/utils";
import { Box, Circle, Minus, Table, Triangle, Type } from "lucide-react";
import React, { useState } from "react";
import { AiOutlineRadarChart } from "react-icons/ai";
import { BiBarChart, BiBox, BiDoughnutChart } from "react-icons/bi";
import {
  BsCardHeading,
  BsCardText,
  BsGlobe,
  BsPieChartFill,
  BsToggleOn,
} from "react-icons/bs";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCompass,
  FaHistory,
  FaImage,
  FaLink,
  FaListUl,
  FaQrcode,
  FaServer,
  FaVideo,
} from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";
import { HiOutlineLightBulb } from "react-icons/hi";
import {
  MdAccessTime,
  MdAlarm,
  MdAssignmentLate,
  MdDashboard,
  MdKeyboard,
  MdLightbulbOutline,
  MdMenu,
  MdMonitor,
  MdMonitorHeart,
  MdPermDeviceInformation,
  MdSwapHoriz,
  MdTextRotationNone,
  MdTrendingUp,
} from "react-icons/md";
import { RxText } from "react-icons/rx";
import { SiPiped } from "react-icons/si";
import {
  TbChartDonut,
  TbChartHistogram,
  TbNumber,
  TbSwitchHorizontal,
} from "react-icons/tb";
import { TiFlowMerge } from "react-icons/ti";
import { VscCombine, VscTerminal } from "react-icons/vsc";

// Widget Type Definition
type WidgetItem = {
  icon: React.ElementType;
  label: string;
  type: string;
  isAdvanced?: boolean;
};

type Category = {
  id: string;
  title: string;
  count: number;
  items: WidgetItem[];
};

export function LeftSidebar() {
  // State for expanded sections (defaulting 'Chart' to open as per request)
  const [openSections, setOpenSections] = useState<string[]>(["chart"]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const categories: Category[] = [
    {
      id: "basic",
      title: "Basic",
      count: 26,
      items: [
        { icon: RxText, label: "text", type: "text" },
        { icon: FaImage, label: "Image", type: "image" },
        { icon: TbNumber, label: "Number", type: "number" },
        { icon: MdLightbulbOutline, label: "Bit Lamp", type: "bit-lamp" },
        { icon: BsCardText, label: "Text Card", type: "textcard" },
        { icon: HiOutlineLightBulb, label: "Word lamp", type: "word-lamp" },
        {
          icon: TbSwitchHorizontal,
          label: "Function switch",
          type: "function-switch",
        },
        { icon: VscCombine, label: "Combination", type: "combination" },
        { icon: BsToggleOn, label: "Bit switch", type: "bit-switch" },
        { icon: MdKeyboard, label: "Word switch", type: "word-switch" },
        { icon: BiBox, label: "Box", type: "box" },
        { icon: FaLink, label: "Hyperlink", type: "hyperlink" },
        { icon: MdAccessTime, label: "Time", type: "time" },
        { icon: VscTerminal, label: "Console", type: "console" },
        { icon: GrStatusInfo, label: "Status", type: "status" },
        { icon: MdMenu, label: "Menu button", type: "menu-button" },
        {
          icon: MdMonitor,
          label: "Indirect screen",
          type: "indirect-screen",
        },
        { icon: BsGlobe, label: "Iframe", type: "iframe" },
        { icon: BsCardHeading, label: "Card", type: "card" },
        {
          icon: MdPermDeviceInformation,
          label: "Device Info",
          type: "device-info",
        },
        { icon: FaVideo, label: "Video window", type: "video-window" },
        {
          icon: MdMonitorHeart,
          label: "Device monitor",
          type: "device-monitor",
        },
        { icon: FaCompass, label: "Navigation", type: "navigation" },
        { icon: FaQrcode, label: "QR Code", type: "qr-code" },
        { icon: MdTextRotationNone, label: "Barrage", type: "barrage" },
        { icon: TiFlowMerge, label: "Flow bar", type: "flow-bar" },
        { icon: SiPiped, label: "Pipe", type: "pipe" },
      ],
    },
    {
      id: "chart",
      title: "Chart",
      count: 17,
      items: [
        { icon: FaChartBar, label: "Bar Chart", type: "chart_bar" },
        { icon: BiBarChart, label: "Histogram", type: "histogram" },
        { icon: MdDashboard, label: "Dashboard", type: "dashboard" },
        { icon: TbChartDonut, label: "Ring chart", type: "ring-chart" },
        { icon: FaChartPie, label: "Pie chart", type: "pie-chart" },
        {
          icon: AiOutlineRadarChart,
          label: "Radar chart",
          type: "radar-chart",
        },
        { icon: MdTrendingUp, label: "Trend chart", type: "trend-chart" },
        { icon: FaHistory, label: "History record", type: "history-record" },
        { icon: MdAlarm, label: "Alarm record", type: "alarm-record" },
        { icon: FaListUl, label: "Scroll list", type: "scroll-list" },
        // Advanced items
        {
          icon: MdAssignmentLate,
          label: "Alarm card list",
          type: "alarm-card-list",
          isAdvanced: true,
        },
        {
          icon: FaServer,
          label: "Devices list",
          type: "devices-list",
          isAdvanced: true,
        },
        {
          icon: BsPieChartFill,
          label: "Pie chart",
          type: "pie-chart",
          isAdvanced: true,
        },
        {
          icon: BiDoughnutChart,
          label: "Ring chart",
          type: "ring-chart",
          isAdvanced: true,
        },
        {
          icon: FaChartLine,
          label: "Line chart",
          type: "line-chart",
          isAdvanced: true,
        },
        {
          icon: TbChartHistogram,
          label: "Histogram",
          type: "histogram",
          isAdvanced: true,
        },
        {
          icon: MdSwapHoriz,
          label: "Horizontal",
          type: "horizontal",
          isAdvanced: true,
        },
      ],
    },
    {
      id: "shape",
      title: "Shape",
      count: 6,
      items: [
        { icon: Minus, label: "Line", type: "line" },
        { icon: Box, label: "Rectangle", type: "rectangle" },
        { icon: Circle, label: "Circle", type: "circle" },
        { icon: Triangle, label: "Triangle", type: "triangle" },
        { icon: Type, label: "Oval", type: "oval" },
        { icon: Table, label: "Table", type: "table" },
      ],
    },
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full z-10">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {categories.map((category) => {
          const isOpen = openSections.includes(category.id);
          return (
            <div
              key={category.id}
              className="border-b border-gray-100 last:border-0"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(category.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors",
                  isOpen ? "text-indigo-600" : "text-gray-700",
                )}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  {isOpen ? (
                    <span className="transform rotate-90 transition-transform duration-200">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  ) : (
                    <span className="transform transition-transform duration-200">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  )}
                  <span>{category.title}</span>
                  <span className="text-xs text-gray-400 font-normal">
                    ({category.count})
                  </span>
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-3 pb-4 bg-gray-50/50 animate-in slide-in-from-top-2 duration-200">
                  {/* Normal Items */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {category.items
                      .filter((i) => !i.isAdvanced)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={(e) => onDragStart(e, item.type)}
                          className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 bg-white hover:border-indigo-500 hover:shadow-sm hover:text-indigo-600 transition-all cursor-move group h-20 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <item.icon
                            size={22}
                            className="mb-2 text-gray-500 group-hover:text-indigo-600 transition-colors relative z-10"
                          />
                          <span className="text-[10px] font-medium text-gray-600 group-hover:text-indigo-600 text-center leading-tight w-full truncate px-1 relative z-10">
                            {item.label}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Advanced Section if exists */}
                  {category.items.some((i) => i.isAdvanced) && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Advanced
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {category.items
                          .filter((i) => i.isAdvanced)
                          .map((item, idx) => (
                            <div
                              key={`adv-${idx}`}
                              draggable
                              onDragStart={(e) => onDragStart(e, item.type)}
                              className="flex flex-col items-center justify-center p-3 rounded-lg border border-indigo-100 bg-indigo-50/30 hover:bg-white hover:border-indigo-500 hover:shadow-md hover:text-indigo-600 transition-all cursor-move group h-20 relative overflow-hidden ring-1 ring-transparent hover:ring-indigo-200"
                            >
                              <div className="absolute top-0 right-0 p-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50" />
                              </div>
                              <item.icon
                                size={22}
                                className="mb-2 text-indigo-400 group-hover:text-indigo-600 transition-colors"
                              />
                              <span className="text-[10px] font-medium text-gray-600 group-hover:text-indigo-600 text-center leading-tight w-full truncate px-1">
                                {item.label}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
