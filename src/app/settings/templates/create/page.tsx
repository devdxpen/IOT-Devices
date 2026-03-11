"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Paintbrush,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { ReactFlowProvider } from "@xyflow/react";
import { CanvasEditor } from "@/features/canvas/CanvasEditor";
import { CanvasPreview } from "@/features/canvas/CanvasPreview";
import { createTemplate } from "@/lib/mock-api/templates";

// ─── Form State ─────────────────────────────────────────
interface TemplateForm {
  // Template Info
  templateName: string;
  templateCode: string;
  templateTags: string[];
  tagInput: string;
  version: string;
  lastUpdateDetails: string;
  typeOfTemplate: string;
  status: string;
  // General Details — Device Details
  brandName: string;
  modelNo: string;
  iconLogo: File | null;
  gatewayDetails: string;
  gatewayModelNo: string;
  projectCode: string;
  // General Details — Description
  description: string;
  // Media & Canvas
  coverPage: File | null;
  graphicalCanvas: string | null; // Stores JSON string
}

const INITIAL_FORM: TemplateForm = {
  templateName: "",
  templateCode: "",
  templateTags: [],
  tagInput: "",
  version: "1.0.0",
  lastUpdateDetails: "",
  typeOfTemplate: "",
  status: "draft",
  brandName: "",
  modelNo: "",
  iconLogo: null,
  gatewayDetails: "",
  gatewayModelNo: "",
  projectCode: "",
  description: "",
  coverPage: null,
  graphicalCanvas: null,
};

export default function CreateTemplatePage() {
  const router = useRouter();
  const [form, setForm] = useState<TemplateForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [coverPagePreview, setCoverPagePreview] = useState<string | null>(null);
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);

  // ─── Form Helpers ───────────────────────────────────────
  const updateField = <K extends keyof TemplateForm>(
    key: K,
    value: TemplateForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const tag = form.tagInput.trim();
    if (tag && !form.templateTags.includes(tag)) {
      setForm((prev) => ({
        ...prev,
        templateTags: [...prev.templateTags, tag],
        tagInput: "",
      }));
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      templateTags: prev.templateTags.filter((t) => t !== tag),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("iconLogo", file);
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = () => {
    updateField("iconLogo", null);
    setIconPreview(null);
  };

  const handleCoverPageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("coverPage", file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeCoverPage = () => {
    updateField("coverPage", null);
    setCoverPagePreview(null);
  };

  const handleSaveCanvas = (jsonStr: string) => {
    updateField("graphicalCanvas", jsonStr);
    setIsCanvasModalOpen(false);
    toast.success("Canvas design saved successfully.");
  };

  const removeCanvas = () => {
    if (confirm("Are you sure you want to remove the canvas design?")) {
      updateField("graphicalCanvas", null);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.templateName.trim()) {
      toast.error("Template Name is required.");
      return;
    }
    if (!form.templateCode.trim()) {
      toast.error("Template Code is required.");
      return;
    }
    if (form.templateTags.length === 0) {
      toast.error("At least one Template Tag is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTemplate({
        templateName: form.templateName,
        templateCode: form.templateCode,
        templateTags: form.templateTags,
        version: form.version,
        lastUpdateDetails: form.lastUpdateDetails,
        typeOfTemplate: form.typeOfTemplate,
        status: form.status as any,
        brandName: form.brandName,
        modelNo: form.modelNo,
        gatewayDetails: form.gatewayDetails,
        gatewayModelNo: form.gatewayModelNo,
        projectCode: form.projectCode,
        description: form.description,
        coverPage: coverPagePreview || undefined, // Send preview URL for mock
        graphicalCanvas: form.graphicalCanvas || undefined,
      });
      toast.success("Template created successfully!");
      router.push("/settings/templates");
    } catch (err) {
      toast.error("Failed to create template.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              New Template Generation
            </h2>
            <p className="text-sm text-slate-500">
              Fill in the details below to create a new device template
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-10 bg-[#2596be] hover:bg-[#1e7c9e] text-white gap-2 px-6 font-medium"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </div>

      {/* ───────────── Section 1: Template Info ───────────── */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-6 pb-3 border-b border-slate-100">
          Template Info
        </h3>

        <div className="flex flex-col gap-5">
          {/* Row 1: Template Name + Template Code */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.templateName}
                onChange={(e) => updateField("templateName", e.target.value)}
                placeholder="Enter template name"
                className="h-10 bg-slate-50 border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Template Code <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.templateCode}
                onChange={(e) => updateField("templateCode", e.target.value)}
                placeholder="Enter template code"
                className="h-10 bg-slate-50 border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Row 2: Template Tags */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Template Tags (For Search & Filtering){" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={form.tagInput}
                onChange={(e) => updateField("tagInput", e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="h-10 bg-slate-50 border-slate-200 text-sm flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="h-10 border-slate-200 text-slate-600 hover:bg-slate-50 gap-1 px-4"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            {form.templateTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.templateTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-blue-50 text-[#2596be] border-[#2596be]/30 px-3 py-1.5 gap-1.5 text-xs font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Row 3: Version + Last Update Details */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Version
              </Label>
              <Input
                value={form.version}
                onChange={(e) => updateField("version", e.target.value)}
                placeholder="e.g. 1.0.0"
                className="h-10 bg-slate-50 border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Last Update Details
              </Label>
              <Input
                value={form.lastUpdateDetails}
                onChange={(e) =>
                  updateField("lastUpdateDetails", e.target.value)
                }
                placeholder="Enter last update info"
                className="h-10 bg-slate-50 border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Row 4: Type of Template + Status */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Type of Template
              </Label>
              <Select
                value={form.typeOfTemplate}
                onValueChange={(val) => updateField("typeOfTemplate", val)}
              >
                <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-sm text-slate-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="device_monitoring">
                    Device Monitoring
                  </SelectItem>
                  <SelectItem value="data_collection">
                    Data Collection
                  </SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="reporting">Reporting</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(val) => updateField("status", val)}
              >
                <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-sm text-slate-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── Section 2: General Details ───────────── */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-6 pb-3 border-b border-slate-100">
          General Details
        </h3>

        {/* Sub-section: Device Details */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-4">
            Device Details
          </h4>
          <div className="flex flex-col gap-5">
            {/* Row 1: Brand Name + Model No */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Brand Name
                </Label>
                <Input
                  value={form.brandName}
                  onChange={(e) => updateField("brandName", e.target.value)}
                  placeholder="Enter brand name"
                  className="h-10 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Model No
                </Label>
                <Input
                  value={form.modelNo}
                  onChange={(e) => updateField("modelNo", e.target.value)}
                  placeholder="Enter model number"
                  className="h-10 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
            </div>

            {/* Row 2: Icon/Logo Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-700">
                Icon / Logo
              </Label>
              <div className="flex items-center gap-4">
                {iconPreview ? (
                  <div className="relative">
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50">
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={removeIcon}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-[#2596be] hover:bg-blue-50/50 transition-colors">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-medium">
                        Upload
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleIconUpload}
                    />
                  </label>
                )}
                <p className="text-xs text-slate-400">
                  Upload a device icon or logo. Supports PNG, JPG, SVG.
                </p>
              </div>
            </div>

            {/* Row 3: Gateway Details + Gateway Model No */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Gateway Details
                </Label>
                <Input
                  value={form.gatewayDetails}
                  onChange={(e) =>
                    updateField("gatewayDetails", e.target.value)
                  }
                  placeholder="Enter gateway details"
                  className="h-10 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Gateway Model No
                </Label>
                <Input
                  value={form.gatewayModelNo}
                  onChange={(e) =>
                    updateField("gatewayModelNo", e.target.value)
                  }
                  placeholder="Enter gateway model number"
                  className="h-10 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
            </div>

            {/* Row 4: Project Code */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Project Code
                </Label>
                <Input
                  value={form.projectCode}
                  onChange={(e) => updateField("projectCode", e.target.value)}
                  placeholder="Enter project code"
                  className="h-10 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Sub-section: Description */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Description
          </Label>
          <Textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Enter a detailed description for this template..."
            className="min-h-[120px] bg-slate-50 border-slate-200 text-sm resize-none"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-8" />

        {/* Sub-section: Media & Canvas */}
        <div className="mb-2">
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-4">
            Media & Canvas
          </h4>
          <div className="grid grid-cols-2 gap-8">
            {/* Cover Page */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-slate-700">
                Cover Page Identity
              </Label>
              <div className="flex flex-col gap-3">
                {coverPagePreview ? (
                  <div className="relative group rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-50 aspect-video">
                    <img
                      src={coverPagePreview}
                      alt="Cover Page preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={removeCoverPage}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-[#2596be] hover:bg-blue-50/50 transition-colors group">
                      <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                        <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-[#2596be]" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-[#2596be]">
                          Click to upload
                        </span>
                        <span className="text-sm text-slate-500">
                          {" "}
                          or drag and drop
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverPageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Graphical Canvas */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-slate-700">
                Graphical Canvas Design
              </Label>
              <div className="flex flex-col gap-3 h-full pb-[28px]">
                {form.graphicalCanvas ? (
                  <div className="relative flex flex-col items-center justify-center h-full rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                      <CanvasPreview jsonStr={form.graphicalCanvas} />
                    </div>
                    {/* Overlay for actions */}
                    <div className="absolute inset-0 z-10 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <p className="text-white font-medium drop-shadow-md">
                        Canvas Designed
                      </p>
                      <p className="text-white/80 text-xs drop-shadow-md">
                        Contains {(() => {
                          try {
                            const parsed = JSON.parse(form.graphicalCanvas);
                            return parsed.pages?.length || 1;
                          } catch {
                            return 1;
                          }
                        })()} pages
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setIsCanvasModalOpen(true)}
                          className="h-8 gap-1.5 bg-white text-slate-800 hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removeCanvas}
                          className="h-8 gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCanvasModalOpen(true)}
                    className="w-full h-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-[#2596be] hover:bg-blue-50/50 transition-colors group p-6"
                  >
                    <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                      <Paintbrush className="w-6 h-6 text-slate-400 group-hover:text-[#2596be]" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-[#2596be]">
                        Design New Canvas
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        Opens the advanced canvas editor
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-10 bg-[#2596be] hover:bg-[#1e7c9e] text-white gap-2 px-8 font-medium"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </div>

      {/* Fullscreen Canvas Editor Modal */}
      {isCanvasModalOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <ReactFlowProvider>
            <CanvasEditor
              initialData={form.graphicalCanvas || undefined}
              onSaveCanvas={handleSaveCanvas}
              onClose={() => setIsCanvasModalOpen(false)}
            />
          </ReactFlowProvider>
        </div>
      )}
    </div>
  );
}
