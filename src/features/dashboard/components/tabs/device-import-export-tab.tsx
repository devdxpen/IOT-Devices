import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function DeviceImportExportTab() {
  return (
    <div className="flex flex-col gap-10">
      {/* Export Settings */}
      <section>
        <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Export Settings
        </h3>
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2">
            <Label className="text-[13px] font-normal text-slate-600">
              Select Configuration Type
            </Label>
            <Select>
              <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Settings</SelectItem>
                <SelectItem value="Network">Network Only</SelectItem>
                <SelectItem value="Alarms">Alarms Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label className="text-[13px] font-normal text-slate-600">
              Export Format
            </Label>
            <Select>
              <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JSON">JSON</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="XML">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white h-11 px-8 rounded-sm">
            <Upload className="w-4 h-4 mr-2" /> Export Configuration
          </Button>
        </div>
      </section>

      {/* Import Settings */}
      <section>
        <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Import Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-[#1ea1f2]/30 bg-blue-50/30 rounded-md p-8 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1ea1f2] mb-1">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Upload Configuration file
            </p>
            <Button
              variant="outline"
              className="h-9 mt-2 text-slate-600 border-slate-200 bg-white shadow-sm"
            >
              <FileUp className="w-4 h-4 mr-2" /> Browse Files
            </Button>
          </div>

          {/* Import Flags */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <Label className="text-[13px] font-normal text-slate-600">
                Select Tags
              </Label>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="backup"
                  defaultChecked
                  className="border-slate-300 data-[state=checked]:bg-[#1ea1f2]"
                />
                <label
                  htmlFor="backup"
                  className="text-sm font-medium leading-none text-slate-700 cursor-pointer"
                >
                  Backup existing settings
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="merge"
                  className="border-slate-300 data-[state=checked]:bg-[#1ea1f2]"
                />
                <label
                  htmlFor="merge"
                  className="text-sm font-medium leading-none text-slate-600 cursor-pointer"
                >
                  Merge with current settings
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="overwrite"
                  className="border-slate-300 data-[state=checked]:bg-[#1ea1f2]"
                />
                <label
                  htmlFor="overwrite"
                  className="text-sm font-medium leading-none text-slate-600 cursor-pointer"
                >
                  Overwrite existing settings
                </label>
              </div>
            </div>

            <Button className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white w-fit h-10 px-8 rounded-sm">
              Import Configuration
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Import Activity */}
      <section>
        <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Recent Import Activity
        </h3>

        <div className="flex flex-col gap-3">
          {/* Activity Item 1 */}
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-md shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-md bg-slate-50 text-slate-600">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-800">
                  Network Configuration Exported
                </h4>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  config_backup_2025-01-15.json
                </p>
              </div>
            </div>
            <span className="text-[12px] text-slate-400">2 hours ago</span>
          </div>

          {/* Activity Item 2 */}
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-md shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-md bg-slate-50 text-slate-600">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-800">
                  Network Configuration Exported
                </h4>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  config_backup_2025-01-15.json
                </p>
              </div>
            </div>
            <span className="text-[12px] text-slate-400">2 hours ago</span>
          </div>
        </div>
      </section>
    </div>
  );
}
