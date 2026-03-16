"use client";

import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  Grid, 
  List,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  Check,
  Monitor,
  Power,
  AlertTriangle,
  Link2Off,
  ChevronUp,
  ChevronDown,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddDeviceModal } from "./components/add-device-modal";
import { mockDevices } from "@/data/mockDevices";
import { cn } from "@/lib/utils";

export function DevicesManagement() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const stats = [
    { label: "Total Devices", value: "10,987", icon: Monitor, color: "text-blue-500", bgColor: "bg-blue-50" },
    { label: "Active Devices", value: "10,987", icon: Power, color: "text-green-500", bgColor: "bg-green-50" },
    { label: "Newly Added", value: "10,987", icon: Plus, color: "text-purple-500", bgColor: "bg-purple-50" },
    { label: "Inactive Devices", value: "10,987", icon: Link2Off, color: "text-red-500", bgColor: "bg-red-50" },
    { label: "Faulty Devices", value: "10,987", icon: AlertTriangle, color: "text-orange-500", bgColor: "bg-orange-50" },
  ];

  const filteredDevices = useMemo(() => {
    return mockDevices.filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.macAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col w-full h-full space-y-6 p-6 bg-slate-50/50">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
            <div className={cn("p-3 rounded-xl", stat.bgColor, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-secondary-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-black text-secondary-900 tracking-tight whitespace-nowrap">Devices Management</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">List View</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 border-slate-200 focus:ring-sky-500 bg-slate-50/50 rounded-xl w-full"
              />
            </div>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white h-11 px-5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Device
            </Button>
            
            <Button variant="ghost" size="icon" className="h-11 w-11 text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all active:scale-95">
              <Trash2 className="w-5 h-5" />
            </Button>

            <Select>
              <SelectTrigger className="h-11 border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 min-w-[140px] px-4">
                <SelectValue placeholder="Select Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-11 px-5 border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200 ml-auto xl:ml-0">
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="icon" 
                className={cn(
                  "h-9 w-9 rounded-lg transition-all", 
                  viewMode === "list" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" : "text-slate-500 hover:text-slate-900"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4.5 h-4.5" />
              </Button>
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="icon" 
                className={cn(
                  "h-9 w-9 rounded-lg transition-all", 
                  viewMode === "grid" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" : "text-slate-500 hover:text-slate-900"
                )}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4.5 h-4.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 transition-all cursor-pointer" />
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Device <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Serial Number <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Category <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    User <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Manufacturer & Model <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Firmware Version <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    MAC Address <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-all group">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 transition-all cursor-pointer" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center relative shadow-sm border border-orange-100 group-hover:scale-110 transition-transform">
                        <img src="/api/placeholder/40/40" alt="" className="w-8 h-8 object-contain" />
                        <span className={cn(
                          "absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm -mt-0.5 -mr-0.5",
                          device.isOnline ? "bg-green-500 shadow-green-500/40" : "bg-red-500 shadow-red-500/40"
                        )} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-secondary-900 tracking-tight group-hover:text-sky-600 transition-colors uppercase">{device.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{device.deviceType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-600 tracking-wide">{device.serialNumber}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-secondary-700">{device.category}</span>
                      <span className="text-[10px] font-bold text-slate-400 italic">Ahmedabad iot</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center -space-x-3 transition-transform group-hover:translate-x-1 duration-300">
                      {[1, 2, 3].map((_, i) => (
                        <Avatar key={i} className="h-8 w-8 border-[2.5px] border-white shadow-md ring-1 ring-slate-100 ring-offset-0">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${device.id}${i}`} />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 border-[2.5px] border-white text-[10px] font-black text-slate-500 shadow-md ring-1 ring-slate-100">
                        +5
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-600 truncate max-w-[200px]">{device.manufacturer}</td>
                  <td className="p-4">
                    <span className="text-[11px] font-black text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200 uppercase tracking-wider whitespace-nowrap">
                      {device.firmwareVersion}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-500 bg-slate-50/50 px-3 py-1.5 rounded-xl border border-slate-100/50 w-fit">{device.macAddress}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg">
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <Edit2 className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Show</span>
            <select className="bg-white border border-slate-200 rounded px-2 py-1 text-sm font-medium text-slate-700 focus:ring-sky-500">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-sm text-slate-500">of 657</span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg border-slate-200">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center">
              <Button size="sm" className="h-8 w-8 p-0 rounded-lg bg-sky-500 text-white shadow-md shadow-sky-500/20">1</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-600">2</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-600">3</Button>
              <span className="px-1 text-slate-400">...</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg border-slate-200">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AddDeviceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}