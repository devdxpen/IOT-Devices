import {
  Upload,
  RotateCw,
  Trash2,
  Power,
  Download,
  KeyRound,
  Play,
  Music,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";

export function DeviceFirmwareTab() {
  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Device Connection Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              Device Connection
            </h3>
          </div>
          <span className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-sm text-xs font-medium border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
            Disconnected
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Enter Device ID"
            className="flex-1 h-11 bg-[#fafafa] border-slate-200 text-sm"
          />
          <Button
            variant="outline"
            className="h-11 px-8 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
          >
            Connect
          </Button>
        </div>
      </section>

      {/* Device Diagnostics Section */}
      <section className="space-y-4 pt-6 border-t border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Device Diagnostics
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">
            Run basic connectivity and maintenance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Left */}
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Network ping test
              </Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter ip address"
                  className="flex-1 h-11 bg-[#fafafa] border-slate-200 text-sm"
                />
                <Button className="h-11 px-6 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 font-medium whitespace-nowrap">
                  Run test <Play className="w-4 h-4 ml-1 fill-current" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1 h-11 bg-white border-slate-200 text-slate-600 shadow-sm"
              >
                Time Scan
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11 bg-white border-slate-200 text-slate-600 shadow-sm"
              >
                Internal Commands
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 bg-white border-slate-200 text-slate-600 shadow-sm"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 bg-red-50 hover:bg-red-100 border-red-200 text-red-500 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Debug View Right */}
          <div className="flex flex-col">
            <Label className="text-[13px] font-normal text-slate-600 mb-2">
              Debug Window
            </Label>
            <div className="flex-1 min-h-[160px] w-full bg-[#1e2330] rounded-md border border-slate-200 p-4 font-mono text-sm text-green-400 overflow-y-auto"></div>
          </div>
        </div>
      </section>

      {/* Reset Server Section */}
      <section className="space-y-4 pt-6 border-t border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Reset Server Connection
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">
            Use if primary server is unreachable or compromised
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-normal text-slate-600">
                  Server URL
                </Label>
                <Input
                  placeholder="Enter server url"
                  className="h-11 bg-[#fafafa] border-slate-200 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-normal text-slate-600">
                  Protocol
                </Label>
                <Select>
                  <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                    <SelectValue placeholder="Enter Protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MQTT">MQTT</SelectItem>
                    <SelectItem value="HTTP">HTTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Parameters
              </Label>
              <Input
                placeholder="Enter parameters"
                className="h-11 bg-[#fafafa] border-slate-200 text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-4 mt-2">
              <Button
                variant="ghost"
                className="text-slate-500 hover:text-slate-800 font-normal"
              >
                Reset to Default
              </Button>
              <Button className="h-10 px-6 bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100">
                Apply
              </Button>
            </div>
          </div>

          <div className="flex flex-col">
            <Label className="text-[13px] font-normal text-slate-600 mb-2">
              Debug Window
            </Label>
            <div className="flex-1 min-h-[160px] w-full bg-[#1e2330] rounded-md border border-slate-200 p-4 font-mono text-sm text-green-400 overflow-y-auto"></div>
          </div>
        </div>
      </section>

      {/* Firmware Updates Section */}
      <section className="space-y-4 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              Firmware Updates
            </h3>
            <p className="text-[13px] text-slate-500 mt-1">
              Current status, manual & automatic updates
            </p>
          </div>
          <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-sm text-xs font-medium border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
            Latest: v2.4.1
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          {/* Version Status Card */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                {/* Using generic icon for 'version' representation since music note seems like an error in mockup */}
                <Download className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-[15px]">
                  v2.4.1 (LTS Build)
                </h4>
                <p className="text-[13px] text-slate-500 mt-1">
                  Current Status{" "}
                  <span className="text-emerald-500 font-medium">
                    Device is up to date
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-md border border-slate-200 p-5 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-slate-800">
                  Backup existing settings
                </Label>
                <Switch className="data-[state=checked]:bg-[#1ea1f2]" />
              </div>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Enable to receive security patches and feature updates
                automatically during off-peak hours.
              </p>
            </div>
          </div>

          {/* Manual Flash Card */}
          <div className="flex flex-col">
            <Label className="text-[13px] font-normal text-slate-600 mb-2">
              Manual Firmware Update
            </Label>
            <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-[#1ea1f2]/30 bg-blue-50/20 rounded-t-md p-8 gap-3">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-sm font-medium text-slate-700">
                Click or drag firmware file
              </p>
              <Button
                variant="outline"
                className="h-9 mt-1 text-slate-600 border-slate-200 bg-white shadow-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Browse Files
              </Button>
            </div>
            <Button className="w-full bg-[#1ea1f2] hover:bg-[#1a90da] text-white h-12 rounded-t-none rounded-b-md text-[15px] font-medium">
              Start Manual Flash
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
        <a
          href="#"
          className="text-sm font-medium text-[#1ea1f2] hover:underline"
        >
          Help Document
        </a>
        <a
          href="#"
          className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          Debug Monitor
        </a>
        <a
          href="#"
          className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          Troubleshooting
        </a>
      </div>

      {/* Quick Guide */}
      <div className="bg-[#f8f9fa] rounded-md border border-slate-200 p-6 mt-4">
        <h4 className="font-semibold text-slate-800 mb-3">Quick guide</h4>
        <ol className="list-decimal list-inside space-y-2 text-[13px] text-slate-500">
          <li>Download the correct firmware for your device model.</li>
          <li>Verify checksum & signature, then upload the package above.</li>
          <li>
            Keep the device powered and connected during install & reboot.
          </li>
        </ol>
      </div>
    </div>
  );
}
