import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeviceConfig } from "../../contexts/DeviceConfigContext";

export function DeviceConnectionTab() {
  const { config, updateConnection } = useDeviceConfig();
  const { connection } = config!;
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-medium text-slate-800">Connection</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form Fields */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="space-y-2">
            <Label className="text-[13px] font-normal text-slate-600">
              Connection Type / Protocol
            </Label>
            <Select
              value={connection.protocol}
              onValueChange={(val) => updateConnection({ protocol: val })}
            >
              <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                <SelectValue placeholder="Select connection type / protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MQTT">MQTT</SelectItem>
                <SelectItem value="HTTP">HTTP</SelectItem>
                <SelectItem value="TCP">TCP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-normal text-slate-600">
              Payload Data Format
            </Label>
            <Select
              value={connection.format}
              onValueChange={(val) => updateConnection({ format: val })}
            >
              <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JSON">JSON</SelectItem>
                <SelectItem value="XML">XML</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-normal text-slate-600">
              Broker URL / API Endpoint
            </Label>
            <Input
              value={connection.brokerUrl}
              onChange={(e) => updateConnection({ brokerUrl: e.target.value })}
              placeholder="Enter url or api endpoint"
              className="h-11 bg-[#fafafa] border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-normal text-slate-600">
              Port Number
            </Label>
            <Input
              value={connection.port}
              onChange={(e) => updateConnection({ port: e.target.value })}
              placeholder="Enter port number"
              className="h-11 bg-[#fafafa] border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label className="text-[13px] font-normal text-slate-600">
              Authentication Details
            </Label>
            <Select
              value={connection.authType}
              onValueChange={(val) => updateConnection({ authType: val })}
            >
              <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                <SelectValue placeholder="Select Auth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Basic">Basic Auth</SelectItem>
                <SelectItem value="Bearer">Bearer Token</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-2 pt-2">
            <Button className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white h-10 px-6 font-medium rounded-sm">
              Test Connection
            </Button>
          </div>
        </div>

        {/* Right Side: Live Data Preview */}
        <div className="col-span-1 flex flex-col space-y-2">
          <Label className="text-[13px] font-normal text-slate-600">
            Live Data Preview
          </Label>
          <div className="flex-1 min-h-[300px] w-full bg-[#1e2330] rounded-md border border-slate-200 p-4 font-mono text-sm text-green-400 overflow-y-auto">
            <div className="opacity-50 text-slate-400 select-none">
              Waiting for incoming data...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
