import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeviceConfig, Parameter } from "../../contexts/DeviceConfigContext";

export function DeviceParametersTab() {
  const { config, setParameters } = useDeviceConfig();
  const { parameters } = config!;

  const [search, setSearch] = useState("");

  const toggleStorage = (id: string, current: boolean) => {
    setParameters(
      parameters.map((p: Parameter) =>
        p.id === id ? { ...p, storage: !current } : p,
      ),
    );
  };

  const toggleShowingData = (id: string, current: boolean) => {
    setParameters(
      parameters.map((p: Parameter) =>
        p.id === id ? { ...p, showingData: !current } : p,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800">Parameters</h2>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-9 h-9 bg-white border-slate-200"
            />
          </div>

          <Button className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 h-9 px-4 rounded-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Parameter
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="h-9 px-4 border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2 rounded-sm"
          >
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium w-12">
                  <Checkbox className="border-slate-300" />
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Tag No <span className="text-[10px] ml-1">▲▼</span>
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Tag Name
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Report Name
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Off-Set
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Min Data
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Max Data
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Unit
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Storage
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Showing Data
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Reporting Details
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parameters.map((param: Parameter) => (
                <tr
                  key={param.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Checkbox className="border-slate-300" />
                  </td>
                  <td className="px-6 py-4 text-slate-700">{param.tagNo}</td>
                  <td className="px-6 py-4 text-slate-700">{param.tagName}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">
                    {param.reportName}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{param.offset}</td>
                  <td className="px-6 py-4 text-slate-700">{param.minData}</td>
                  <td className="px-6 py-4 text-slate-700">{param.maxData}</td>
                  <td className="px-6 py-4 text-slate-700">{param.unit}</td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={param.storage}
                      onCheckedChange={() =>
                        toggleStorage(param.id, param.storage)
                      }
                      className="data-[state=checked]:bg-[#1ea1f2] scale-90"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={param.showingData}
                      onCheckedChange={() =>
                        toggleShowingData(param.id, param.showingData)
                      }
                      className="data-[state=checked]:bg-[#1ea1f2] scale-90"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {param.reportingDetails}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Show</span>
            <select className="border border-slate-200 rounded px-2 py-1 text-slate-700 outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <span>of 657</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-slate-500 font-normal"
            >
              {"<"} Previous
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 w-8 bg-[#1ea1f2] hover:bg-[#1a90da] text-white p-0"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 text-slate-600 p-0 font-normal"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 text-slate-600 p-0 font-normal"
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 text-slate-600 p-0 font-normal border-transparent hover:bg-transparent cursor-default"
            >
              ...
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-slate-500 font-normal"
            >
              Next {">"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
