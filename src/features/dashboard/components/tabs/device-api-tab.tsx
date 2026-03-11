"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pause, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useDeviceConfig,
  type ApiEndpoint,
} from "../../contexts/DeviceConfigContext";

// ─── Types ──────────────────────────────────────────────
interface EndpointForm {
  endpointName: string;
  targetUrl: string;
  httpMethod: string;
  syncInterval: string;
  tags: string;
}

const INITIAL_FORM: EndpointForm = {
  endpointName: "",
  targetUrl: "",
  httpMethod: "",
  syncInterval: "",
  tags: "",
};

// ─── Component ──────────────────────────────────────────
export function DeviceApiTab() {
  const { config, updateApi, setApiEndpoints } = useDeviceConfig();
  const api = config?.api;
  const endpoints = api?.endpoints ?? [];

  // Form State
  const [form, setForm] = useState<EndpointForm>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Selected endpoint for detail panel
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(
    endpoints.length > 0 ? endpoints[0].id : null,
  );

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const selectedEndpoint =
    endpoints.find((ep) => ep.id === selectedEndpointId) ?? null;

  // ─── Format Checkbox Toggle ───────────────────────────
  const toggleFormat = (format: string, checked: boolean) => {
    if (!api) return;
    if (checked) {
      updateApi({ formats: [...api.formats, format] });
    } else {
      updateApi({ formats: api.formats.filter((f: string) => f !== format) });
    }
  };

  // ─── Endpoint Form Handlers ───────────────────────────
  const updateField = (field: keyof EndpointForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveConfiguration = () => {
    if (!form.endpointName.trim() || !form.targetUrl.trim()) {
      toast.error("Endpoint Name and Target URL are required.");
      return;
    }
    if (!form.httpMethod) {
      toast.error("Please select an HTTP Method.");
      return;
    }

    if (editingId) {
      const updated = endpoints.map((ep) =>
        ep.id === editingId
          ? {
              ...ep,
              endpointName: form.endpointName,
              targetUrl: form.targetUrl,
              httpMethod: form.httpMethod,
              syncInterval: form.syncInterval,
              tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            }
          : ep,
      );
      setApiEndpoints(updated);
      setSelectedEndpointId(editingId);
      setEditingId(null);
      toast.success("Endpoint updated successfully.");
    } else {
      const newEndpoint: ApiEndpoint = {
        id: `ep-${Date.now()}`,
        endpointName: form.endpointName,
        targetUrl: form.targetUrl,
        httpMethod: form.httpMethod,
        syncInterval: form.syncInterval,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        lastSyncTime: "-",
        status: "active",
      };
      setApiEndpoints([...endpoints, newEndpoint]);
      setSelectedEndpointId(newEndpoint.id);
      toast.success("Endpoint saved successfully.");
    }

    setForm(INITIAL_FORM);
  };

  const handleTestApiCall = () => {
    if (!form.targetUrl.trim()) {
      toast.error("Enter a Target URL to test.");
      return;
    }
    toast.success("API call test initiated successfully.");
  };

  const handleEdit = (ep: ApiEndpoint) => {
    setForm({
      endpointName: ep.endpointName,
      targetUrl: ep.targetUrl,
      httpMethod: ep.httpMethod,
      syncInterval: ep.syncInterval,
      tags: ep.tags.join(", "),
    });
    setEditingId(ep.id);
  };

  const handleDelete = (id: string) => {
    const updated = endpoints.filter((ep) => ep.id !== id);
    setApiEndpoints(updated);
    if (selectedEndpointId === id) {
      setSelectedEndpointId(updated.length > 0 ? updated[0].id : null);
    }
    setDeleteConfirmId(null);
    toast.success("Endpoint deleted successfully.");
  };

  const handlePause = (id: string) => {
    const updated = endpoints.map((ep) =>
      ep.id === id
        ? {
            ...ep,
            status: (ep.status === "active" ? "paused" : "active") as
              | "active"
              | "paused",
          }
        : ep,
    );
    setApiEndpoints(updated);
    const ep = updated.find((e) => e.id === id);
    toast.success(
      `Endpoint ${ep?.status === "paused" ? "paused" : "resumed"} successfully.`,
    );
  };

  if (!api) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-medium text-slate-800">API</h2>
      </div>

      {/* ───────────── Section 1: Trigger Selection ───────────── */}
      <div className="bg-white rounded-md border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-100">
          Trigger Selection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-700 uppercase tracking-wide">
              Trigger Type
            </Label>
            <Select
              value={api.triggerType}
              onValueChange={(val) => updateApi({ triggerType: val })}
            >
              <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-slate-700">
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interval">Interval</SelectItem>
                <SelectItem value="frame">Frame IN-OUT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-700 uppercase tracking-wide">
              Interval Setup (Seconds)
            </Label>
            <Select
              value={api.intervalSeconds}
              onValueChange={(val) => updateApi({ intervalSeconds: val })}
            >
              <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-slate-700">
                <SelectValue placeholder="Select interval time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Seconds</SelectItem>
                <SelectItem value="30">30 Seconds</SelectItem>
                <SelectItem value="60">60 Seconds (1 Min)</SelectItem>
                <SelectItem value="300">300 Seconds (5 Min)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ───────────── Section 2: Protocol Settings ───────────── */}
      <div className="bg-white rounded-md border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-100">
          Protocol Settings
        </h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-700 uppercase tracking-wide">
              Primary Protocol
            </Label>
            <Select
              value={api.primaryProtocol}
              onValueChange={(val) => updateApi({ primaryProtocol: val })}
            >
              <SelectTrigger className="h-10 w-[300px] bg-slate-50 border-slate-200 text-slate-700">
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mqtt">MQTT</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-xs font-medium text-slate-700 uppercase tracking-wide">
              Optional Formats (Select Multiple)
            </Label>
            <div className="flex items-center gap-6 mt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fmt-json"
                  checked={api.formats.includes("JSON")}
                  onCheckedChange={(c) => toggleFormat("JSON", c === true)}
                  className="border-slate-300 data-[state=checked]:bg-[#1ea1f2] data-[state=checked]:border-[#1ea1f2]"
                />
                <label
                  htmlFor="fmt-json"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
                >
                  JSON
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fmt-xml"
                  checked={api.formats.includes("XML")}
                  onCheckedChange={(c) => toggleFormat("XML", c === true)}
                  className="border-slate-300 data-[state=checked]:bg-[#1ea1f2] data-[state=checked]:border-[#1ea1f2]"
                />
                <label
                  htmlFor="fmt-xml"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
                >
                  XML
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fmt-csv"
                  checked={api.formats.includes("CSV")}
                  onCheckedChange={(c) => toggleFormat("CSV", c === true)}
                  className="border-slate-300 data-[state=checked]:bg-[#1ea1f2] data-[state=checked]:border-[#1ea1f2]"
                />
                <label
                  htmlFor="fmt-csv"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
                >
                  CSV Payload
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── Section 3: Custom API Calls ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel — Form */}
        <div className="bg-white rounded-md border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Custom API Calls
          </h3>

          <div className="flex flex-col gap-5">
            {/* Row 1: Endpoint Name + Target URL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Endpoint Name
                </Label>
                <Input
                  value={form.endpointName}
                  onChange={(e) => updateField("endpointName", e.target.value)}
                  placeholder="Enter endpoint"
                  className="h-10 bg-slate-50 border-slate-200 text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Target URL
                </Label>
                <Input
                  value={form.targetUrl}
                  onChange={(e) => updateField("targetUrl", e.target.value)}
                  placeholder="Enter url"
                  className="h-10 bg-slate-50 border-slate-200 text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row 2: HTTP Method + Sync Interval */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  HTTP Method
                </Label>
                <Select
                  value={form.httpMethod}
                  onValueChange={(val) => updateField("httpMethod", val)}
                >
                  <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-sm text-slate-500">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Get">GET</SelectItem>
                    <SelectItem value="Post">POST</SelectItem>
                    <SelectItem value="Put">PUT</SelectItem>
                    <SelectItem value="Delete">DELETE</SelectItem>
                    <SelectItem value="Patch">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Sync Interval
                </Label>
                <Input
                  value={form.syncInterval}
                  onChange={(e) => updateField("syncInterval", e.target.value)}
                  placeholder="Enter sync interval"
                  className="h-10 bg-slate-50 border-slate-200 text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row 3: Select Tags */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Select Tags
              </Label>
              <Select
                value={form.tags || undefined}
                onValueChange={(val) => updateField("tags", val)}
              >
                <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-sm text-slate-500">
                  <SelectValue placeholder="Select tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T1, T2, T3">T1, T2, T3</SelectItem>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                  <SelectItem value="T1, T2">T1, T2</SelectItem>
                  <SelectItem value="T2, T3">T2, T3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button
                onClick={handleSaveConfiguration}
                className="h-11 bg-[#2596be] hover:bg-[#1e7c9e] text-white font-medium rounded-md"
              >
                {editingId ? "Update Configuration" : "Save Configuration"}
              </Button>
              <Button
                onClick={handleTestApiCall}
                className="h-11 bg-[#2596be] hover:bg-[#1e7c9e] text-white font-medium rounded-md"
              >
                Test API Call
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel — Configured API Endpoints */}
        <div className="bg-white rounded-md border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Configured API Endpoints
          </h3>

          {selectedEndpoint ? (
            <div className="flex flex-col gap-5">
              {/* Endpoint Details */}
              <div className="border border-slate-100 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <DetailRow
                      label="Endpoint Name"
                      value={selectedEndpoint.endpointName}
                    />
                    <DetailRow label="URL" value={selectedEndpoint.targetUrl} />
                    <DetailRow
                      label="Method"
                      value={selectedEndpoint.httpMethod}
                    />
                    <DetailRow
                      label="Interval"
                      value={selectedEndpoint.syncInterval}
                    />
                    <DetailRow
                      label="Tags"
                      value={selectedEndpoint.tags.join(", ")}
                    />
                    <DetailRow
                      label="Last sync time"
                      value={selectedEndpoint.lastSyncTime}
                    />
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handlePause(selectedEndpoint.id)}
                  className="h-10 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium gap-2"
                >
                  <Pause className="w-4 h-4" />
                  {selectedEndpoint.status === "paused" ? "Resume" : "Pause"}
                </Button>
                <Button
                  onClick={() => handleEdit(selectedEndpoint)}
                  className="h-10 bg-[#1C2C4F] hover:bg-[#152240] text-white font-medium gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(selectedEndpoint.id)}
                  className="h-10 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>

              {/* Endpoint selector when multiple exist */}
              {endpoints.length > 1 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {endpoints.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpointId(ep.id)}
                      className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                        selectedEndpointId === ep.id
                          ? "bg-[#2596be] text-white border-[#2596be]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {ep.endpointName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <span className="text-2xl text-slate-400">📡</span>
              </div>
              <h4 className="text-base font-semibold text-slate-800">
                No Endpoints Configured
              </h4>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Add a custom API endpoint using the form on the left to get
                started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-slate-900">
              Delete API Endpoint?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 mt-2 text-base">
              Are you sure you want to delete this endpoint? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 px-5 text-slate-600 border-slate-200 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Delete Endpoint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Detail Row for Endpoint Card ─────────────────────────
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="py-2.5 px-4 text-slate-500 font-normal whitespace-nowrap w-[140px]">
        {label}
      </td>
      <td className="py-2.5 px-4 text-slate-800 font-medium text-right">
        {value || "-"}
      </td>
    </tr>
  );
}
