import {
  Cloud,
  Clock,
  Database,
  Download,
  Trash2,
  Plus,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeviceBackupTab() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between shadow-sm">
          <h4 className="text-[13px] font-medium text-slate-500 mb-4">
            Total Backups
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <span className="text-2xl font-semibold text-slate-800">40</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between shadow-sm">
          <h4 className="text-[13px] font-medium text-slate-500 mb-4">
            Last backup
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-2xl font-semibold text-slate-800">
              2h ago
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between shadow-sm">
          <h4 className="text-[13px] font-medium text-slate-500 mb-4">
            Storage Used
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <span className="text-2xl font-semibold text-slate-800">
              4.2 GB{" "}
              <span className="text-slate-400 font-normal text-lg">
                / 10 GB
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Backup Table Section */}
      <div className="flex flex-col mt-4">
        {/* Table Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Backup</h2>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-9 px-4 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Manual Backup
            </Button>
            <Button className="h-9 px-4 bg-[#1ea1f2] hover:bg-[#1a90da] text-white">
              <Download className="w-4 h-4 mr-2" /> Download all data
            </Button>
            <Button
              variant="outline"
              className="h-9 px-4 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Erase all data
            </Button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[13px] text-slate-500 bg-white border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Backup Name <span className="text-[10px] ml-1">▲▼</span>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Date and Time <span className="text-[10px] ml-1">▲▼</span>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Size <span className="text-[10px] ml-1">▲▼</span>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Status <span className="text-[10px] ml-1">▲▼</span>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Users <span className="text-[10px] ml-1">▲▼</span>
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    Backup 1
                  </td>
                  <td className="px-6 py-4 text-slate-700">12/Jan/2025</td>
                  <td className="px-6 py-4 text-slate-700">120 MB</td>
                  <td className="px-6 py-4">
                    <span className="flex w-fit items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-sm text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                      Failed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src="https://i.pravatar.cc/150?u=1"
                      alt="User"
                      className="w-6 h-6 rounded-full border border-slate-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <RotateCw className="w-4 h-4" />
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

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    Backup 1
                  </td>
                  <td className="px-6 py-4 text-slate-700">12/Jan/2025</td>
                  <td className="px-6 py-4 text-slate-700">120 MB</td>
                  <td className="px-6 py-4">
                    <span className="flex w-fit items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-sm text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src="https://i.pravatar.cc/150?u=1"
                      alt="User"
                      className="w-6 h-6 rounded-full border border-slate-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <RotateCw className="w-4 h-4" />
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

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    Backup 1
                  </td>
                  <td className="px-6 py-4 text-slate-700">12/Jan/2025</td>
                  <td className="px-6 py-4 text-slate-700">120 MB</td>
                  <td className="px-6 py-4">
                    <span className="flex w-fit items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-sm text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                      Failed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src="https://i.pravatar.cc/150?u=1"
                      alt="User"
                      className="w-6 h-6 rounded-full border border-slate-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <RotateCw className="w-4 h-4" />
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

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    Backup 1
                  </td>
                  <td className="px-6 py-4 text-slate-700">12/Jan/2025</td>
                  <td className="px-6 py-4 text-slate-700">120 MB</td>
                  <td className="px-6 py-4">
                    <span className="flex w-fit items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-sm text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                      Failed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src="https://i.pravatar.cc/150?u=1"
                      alt="User"
                      className="w-6 h-6 rounded-full border border-slate-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                    >
                      <RotateCw className="w-4 h-4" />
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
    </div>
  );
}
