import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { addDevice } from "../api/deviceApi";

export function AddDeviceManualForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [modelNo, setModelNo] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Quick extraction without fully controlled components
    const formData = new FormData(e.currentTarget);
    const deviceId = (document.getElementById("deviceId") as HTMLInputElement)
      ?.value;
    const deviceName = (
      document.getElementById("deviceName") as HTMLInputElement
    )?.value;
    const macAddress = (
      document.getElementById("macAddress") as HTMLInputElement
    )?.value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    )?.value;

    setIsSubmitting(true);
    try {
      await addDevice({
        name: deviceName || brandName,
        serialNumber: deviceId,
        manufacturer: brandName,
        model: modelNo,
        macAddress: macAddress || "00:00:00:00:00:00",
        brandName: brandName,
        industry: "General",
        category: "Sensor",
        cluster: "Cluster A",
        group: "Default Group",
      });
      toast.success("Device added successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to add device");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="space-y-6 flex-1">
        {/* Row 1: Brand Name & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <Label
              htmlFor="brandName"
              className="text-[13px] text-slate-600 font-normal flex items-center gap-1 uppercase tracking-wider"
            >
              Brand Name <span className="text-red-500">*</span>
            </Label>
            <Select value={brandName} onValueChange={setBrandName} required>
              <SelectTrigger
                id="brandName"
                className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm"
              >
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                <SelectItem value="GlobalTech">GlobalTech</SelectItem>
                <SelectItem value="NetSys">NetSys</SelectItem>
                <SelectItem value="SensoriX">SensoriX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="modelNo"
              className="text-[13px] text-slate-600 font-normal uppercase tracking-wider"
            >
              Model
            </Label>
            <Select value={modelNo} onValueChange={setModelNo}>
              <SelectTrigger
                id="modelNo"
                className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm"
              >
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectItem value="T-100">T-100</SelectItem>
                <SelectItem value="H-200">H-200</SelectItem>
                <SelectItem value="GW-P1">GW-P1</SelectItem>
                <SelectItem value="TX-500">TX-500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Device ID, Image & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <Label
              htmlFor="deviceId"
              className="text-[13px] text-slate-600 font-normal flex items-center gap-1 uppercase tracking-wider"
            >
              Device ID / Serial No <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deviceId"
              placeholder="Enter serial number"
              required
              className="bg-[#fafafa] border-slate-200 h-11 text-sm rounded-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label className="text-[13px] text-slate-600 font-normal block uppercase tracking-wider">
                Upload Device Image
              </Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="w-[50px] h-[50px] bg-[#75c6fb] rounded-sm flex items-center justify-center text-white hover:bg-[#60bdfa] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div className="w-[50px] h-[50px] bg-white rounded-full border border-slate-200 overflow-hidden relative shadow-sm flex items-center justify-center p-1">
                  {/* Placeholder for actual image upload preview */}
                  <img
                    src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=100&q=80"
                    alt="Device preview"
                    className="object-cover rounded-full pointer-events-none"
                  />
                  <div className="absolute bottom-0 right-0 bg-[#1ea1f2] border border-white text-white p-0.5 rounded-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 ml-8">
              <Label className="text-[13px] text-slate-600 font-normal block uppercase tracking-wider">
                Status
              </Label>
              <div className="pt-2">
                <Switch id="device-status" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Name/Tag & MAC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <Label
              htmlFor="deviceName"
              className="text-[13px] text-slate-600 font-normal uppercase tracking-wider"
            >
              Device Name/Tag
            </Label>
            <Input
              id="deviceName"
              placeholder="Enter device tag"
              className="bg-[#fafafa] border-slate-200 h-11 text-sm rounded-sm"
            />
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="macAddress"
              className="text-[13px] text-slate-600 font-normal uppercase tracking-wider"
            >
              MAC Address
            </Label>
            <Input
              id="macAddress"
              placeholder="Enter mac address"
              className="bg-[#fafafa] border-slate-200 h-11 text-sm rounded-sm"
            />
          </div>
        </div>

        {/* Row 4: Industry & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <Label
              htmlFor="industry"
              className="text-[13px] text-slate-600 font-normal uppercase tracking-wider"
            >
              Industry
            </Label>
            <Select>
              <SelectTrigger
                id="industry"
                className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm"
              >
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="category"
              className="text-[13px] text-slate-600 font-normal uppercase tracking-wider"
            >
              Device Category
            </Label>
            <Select>
              <SelectTrigger
                id="category"
                className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm"
              >
                <SelectValue placeholder="Select device category" />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectItem value="sensor">Sensor</SelectItem>
                <SelectItem value="gateway">Gateway</SelectItem>
                <SelectItem value="actuator">Actuator</SelectItem>
                <SelectItem value="controller">Controller</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 5: Description */}
        <div className="space-y-2.5">
          <Label
            htmlFor="description"
            className="text-[13px] text-slate-600 font-normal uppercase tracking-wider"
          >
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter description"
            className="resize-none h-24 bg-[#fafafa] border-slate-200 rounded-sm text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 mt-6 border-t border-slate-100 -mx-6 px-6 pb-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-slate-200 text-slate-700 font-normal px-8 h-10 rounded-sm hover:bg-slate-50 flex items-center justify-center bg-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white font-normal px-8 h-10 rounded-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Add Device
        </Button>
      </div>
    </form>
  );
}
