import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Globe,
  HardDrive,
  Search,
  CheckCircle2,
  ChevronDown,
  Loader2,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { addDevice } from "../api/deviceApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Template Data
const mockTemplates = [
  {
    id: "t1",
    name: "Alpha Temp Sensor V1",
    brand: "Acme Corp",
    model: "T-100",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t2",
    name: "Beta Humidity Monitor",
    brand: "GlobalTech",
    model: "H-200",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t3",
    name: "Alpha Temp Sensor V1",
    brand: "Acme Corp",
    model: "T-100",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t4",
    name: "Beta Humidity Monitor",
    brand: "GlobalTech",
    model: "H-200",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t5",
    name: "Local Gateway Pro",
    brand: "NetSys",
    model: "GW-P1",
    scope: "local",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
];

export function AddDeviceTemplateForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState("global");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");

  // Computed values
  const filteredTemplates = mockTemplates.filter(
    (t) =>
      t.scope === searchScope &&
      (selectedBrand === "all" || t.brand === selectedBrand) &&
      (selectedModel === "all" || t.model === selectedModel) &&
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.model.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const selectedTemplate = mockTemplates.find(
    (t) => t.id === selectedTemplateId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDevice({
        name: selectedTemplate.name,
        manufacturer: selectedTemplate.brand,
        model: selectedTemplate.model,
        category: "Template",
      });
      toast.success(`Device added using ${selectedTemplate.name} template`);
      onSuccess();
    } catch (err) {
      toast.error("Failed to add device");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-[#fcfcfc]">
      {/* Top Search & Read-only fields Row */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 md:col-span-6 space-y-2">
          <Label
            htmlFor="templateSearch"
            className="text-[13px] text-slate-600 font-normal flex items-center gap-1"
          >
            Search templates
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              id="templateSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by template name, code, or tags..."
              className="bg-[#fafafa] pl-10 h-11 border-slate-200 text-sm rounded-sm"
            />
          </div>
        </div>

        <div className="col-span-6 md:col-span-3 space-y-2">
          <Label className="text-[13px] text-slate-600 font-normal flex items-center gap-1">
            Brand name
          </Label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="Acme Corp">Acme Corp</SelectItem>
              <SelectItem value="GlobalTech">GlobalTech</SelectItem>
              <SelectItem value="NetSys">NetSys</SelectItem>
              <SelectItem value="SensoriX">SensoriX</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-6 md:col-span-3 space-y-2">
          <Label className="text-[13px] text-slate-600 font-normal">
            Model
          </Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="T-100">T-100</SelectItem>
              <SelectItem value="H-200">H-200</SelectItem>
              <SelectItem value="GW-P1">GW-P1</SelectItem>
              <SelectItem value="TX-500">TX-500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Scope Tabs */}
      <div className="flex w-full max-w-[500px] mb-6 rounded-sm overflow-hidden border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => {
            setSearchScope("global");
            setSelectedTemplateId(null);
          }}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            searchScope === "global"
              ? "bg-[#1ea1f2] text-white"
              : "text-slate-600 hover:bg-slate-50",
          )}
        >
          Global Template
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchScope("local");
            setSelectedTemplateId(null);
          }}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors border-l border-slate-200",
            searchScope === "local"
              ? "bg-[#1ea1f2] text-white"
              : "text-slate-600 hover:bg-slate-50",
          )}
        >
          Local Template
        </button>
      </div>

      {/* Grid of Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px] custom-scrollbar pb-6 overflow-y-auto pr-2">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              className={cn(
                "bg-white rounded-md border overflow-hidden cursor-pointer transition-all shadow-sm flex flex-col hover:shadow-md",
                selectedTemplateId === template.id
                  ? "border-[#1ea1f2] ring-1 ring-[#1ea1f2]"
                  : "border-slate-200 hover:border-slate-300",
              )}
            >
              <div className="h-44 w-full bg-slate-100 relative">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white flex flex-col">
                <h3 className="text-[17px] font-normal text-slate-800 mb-1">
                  {template.name}
                </h3>
                <p className="text-[14px] text-slate-500">
                  {template.brand} • {template.model}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white border border-slate-200 rounded-md">
            <p className="text-slate-500">No templates found.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6 mt-auto border-t border-slate-100 -mx-6 px-6 pb-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="border-slate-200 text-slate-700 font-normal px-8 h-10 rounded-sm hover:bg-slate-50 flex items-center justify-center bg-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!selectedTemplate || isSubmitting}
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
