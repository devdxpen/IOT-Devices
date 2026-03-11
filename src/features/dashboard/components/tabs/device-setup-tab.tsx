import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, SearchIcon, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDeviceConfig } from "../../contexts/DeviceConfigContext";
import { getDeviceTemplates } from "../../api/deviceConfigApi";

type Template = {
  id: string;
  name: string;
  brand: string;
  model: string;
  scope: string;
  image: string;
};

export function DeviceSetupTab() {
  const { config, updateGeneral } = useDeviceConfig();
  const { general } = config!;

  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState("global");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");

  useEffect(() => {
    let mounted = true;
    setIsLoadingTemplates(true);
    getDeviceTemplates().then((data) => {
      if (mounted) {
        setTemplates(data);
        setIsLoadingTemplates(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTemplates = templates.filter(
    (t) =>
      t.scope === searchScope &&
      (selectedBrand === "all" || t.brand === selectedBrand) &&
      (selectedModel === "all" || t.model === selectedModel) &&
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.model.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleApplyTemplate = (templateId: string) => {
    if (general.templateId === templateId) {
      updateGeneral({ templateId: null });
      toast.success("Template removed");
    } else {
      updateGeneral({ templateId });
      toast.success("Template applied to configuration");
    }
  };

  const appliedTemplate = templates.find((t) => t.id === general.templateId);

  return (
    <div className="flex flex-col">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="flex w-full justify-start mb-6 h-auto p-0 bg-transparent border-b border-slate-100 rounded-none">
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white data-[state=active]:border-transparent border border-transparent rounded-sm text-slate-500 font-normal px-6 py-2 transition-colors mr-2"
          >
            Manual Configuration
          </TabsTrigger>
          <TabsTrigger
            value="template"
            className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white data-[state=active]:border-transparent border border-transparent rounded-sm text-slate-500 font-normal px-6 py-2 transition-colors"
          >
            Apply Template
          </TabsTrigger>
        </TabsList>

        <div className="bg-[#fcfcfc] p-1">
          {/* TAB 1: Manual Configuration */}
          <TabsContent
            value="manual"
            className="mt-0 outline-none flex flex-col gap-8"
          >
            {/* Applied Template Banner */}
            {appliedTemplate && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-md p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img
                      src={appliedTemplate.image}
                      alt={appliedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-medium text-blue-600 uppercase tracking-wide mb-0.5">
                      Applied Template
                    </h4>
                    <p className="text-slate-800 font-medium">
                      {appliedTemplate.name}{" "}
                      <span className="text-slate-500 font-normal ml-1">
                        • {appliedTemplate.brand} {appliedTemplate.model}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => updateGeneral({ templateId: null })}
                  className="h-9 px-4 text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" /> Remove Template
                </Button>
              </div>
            )}

            <section className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Brand Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={general.brand}
                    onChange={(e) => updateGeneral({ brand: e.target.value })}
                    placeholder="Enter brand name"
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Model
                  </Label>
                  <Input
                    value={general.model}
                    onChange={(e) => updateGeneral({ model: e.target.value })}
                    placeholder="Enter model"
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Device ID / Serial No{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={general.serial}
                    onChange={(e) => updateGeneral({ serial: e.target.value })}
                    placeholder="Enter serial number"
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-2 shrink-0">
                    <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                      Upload Device Image
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 bg-blue-50 border-transparent text-[#1ea1f2] hover:bg-blue-100"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                      <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute w-6 h-6 bg-slate-300 rounded-full rotate-45 transform" />
                        <div className="absolute w-4 h-4 bg-slate-800 rounded-full -bottom-1 -right-1" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col justify-between items-end h-full pt-1">
                    <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                      Status
                    </Label>
                    <Switch
                      checked={general.isActive}
                      onCheckedChange={(checked) =>
                        updateGeneral({ isActive: checked })
                      }
                      className="data-[state=checked]:bg-[#1ea1f2] mb-2 scale-110"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Device Name/Tag
                  </Label>
                  <Input
                    value={general.deviceName}
                    onChange={(e) =>
                      updateGeneral({ deviceName: e.target.value })
                    }
                    placeholder="Enter device tag"
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Mac Address
                  </Label>
                  <Input
                    value={general.mac}
                    onChange={(e) => updateGeneral({ mac: e.target.value })}
                    placeholder="Enter mac address"
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Industry
                  </Label>
                  <Select
                    value={general.industry}
                    onValueChange={(value) =>
                      updateGeneral({ industry: value })
                    }
                  >
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-slate-500">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Building Management">
                        Building Management
                      </SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Device Category
                  </Label>
                  <Select
                    value={general.category}
                    onValueChange={(value) =>
                      updateGeneral({ category: value })
                    }
                  >
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-slate-500">
                      <SelectValue placeholder="Select device category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Air Quality">Air Quality</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="controller">Controller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium text-slate-800 mb-6 border-b border-slate-100 pb-2">
                General Setup
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                      Device ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={config!.id}
                      disabled
                      placeholder="Enter device id"
                      className="h-11 bg-slate-50 border-slate-200 text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                      Group
                    </Label>
                    <Select
                      value={general.group}
                      onValueChange={(value) => updateGeneral({ group: value })}
                    >
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-slate-500">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Floor 2">Floor 2</SelectItem>
                        <SelectItem value="g1">Group 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                      Cluster
                    </Label>
                    <Select
                      value={general.cluster}
                      onValueChange={(value) =>
                        updateGeneral({ cluster: value })
                      }
                    >
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-slate-500">
                        <SelectValue placeholder="Select cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HQ Building">HQ Building</SelectItem>
                        <SelectItem value="c1">Cluster 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 h-full flex flex-col">
                    <Label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                      Description
                    </Label>
                    <Textarea
                      value={general.description}
                      onChange={(e) =>
                        updateGeneral({ description: e.target.value })
                      }
                      placeholder="Enter description"
                      className="flex-1 min-h-[100px] bg-slate-50 border-slate-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* TAB 2: Apply Template */}
          <TabsContent
            value="template"
            className="mt-0 outline-none flex flex-col pt-1"
          >
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 md:col-span-6 space-y-2">
                <Label className="text-[13px] text-slate-600 font-normal flex items-center gap-1">
                  Search templates
                </Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by template name, code, or tags..."
                    className="bg-[#fafafa] pl-10 h-11 border-slate-200 text-sm rounded-sm focus-visible:ring-[#1ea1f2]"
                  />
                </div>
              </div>

              <div className="col-span-6 md:col-span-3 space-y-2">
                <Label className="text-[13px] text-slate-600 font-normal flex items-center gap-1">
                  Brand name
                </Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm focus-visible:ring-[#1ea1f2]">
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
                  <SelectTrigger className="bg-[#fafafa] border-slate-200 h-11 text-slate-500 rounded-sm focus-visible:ring-[#1ea1f2]">
                    <SelectValue placeholder="All Models" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    <SelectItem value="all">All Models</SelectItem>
                    <SelectItem value="T-100">T-100</SelectItem>
                    <SelectItem value="H-200">H-200</SelectItem>
                    <SelectItem value="GW-P1">GW-P1</SelectItem>
                    <SelectItem value="TX-500">TX-500</SelectItem>
                    <SelectItem value="LC-300">LC-300</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full max-w-[500px] mb-6 rounded-sm overflow-hidden border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setSearchScope("global")}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors outline-none",
                  searchScope === "global"
                    ? "bg-[#1ea1f2] text-white"
                    : "text-slate-600 hover:bg-slate-50 focus-visible:bg-slate-50",
                )}
              >
                Global Template
              </button>
              <button
                type="button"
                onClick={() => setSearchScope("local")}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors border-l border-slate-200 outline-none",
                  searchScope === "local"
                    ? "bg-[#1ea1f2] text-white"
                    : "text-slate-600 hover:bg-slate-50 focus-visible:bg-slate-50",
                )}
              >
                Local Template
              </button>
            </div>

            {/* Template Grid */}
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-12 min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#1ea1f2]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6 pr-2 min-h-[300px]">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        "bg-white rounded-md border overflow-hidden transition-all shadow-sm flex flex-col hover:shadow-md",
                        general.templateId === template.id
                          ? "border-[#1ea1f2] ring-1 ring-[#1ea1f2]"
                          : "border-slate-200 hover:border-slate-300",
                      )}
                    >
                      <div className="h-32 w-full bg-slate-100 relative">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-white flex flex-col flex-1">
                        <h3 className="text-[15px] font-medium text-slate-800 mb-1">
                          {template.name}
                        </h3>
                        <p className="text-[13px] text-slate-500 mb-4">
                          {template.brand} • {template.model}
                        </p>
                        <div className="mt-auto">
                          <Button
                            onClick={() => handleApplyTemplate(template.id)}
                            variant={
                              general.templateId === template.id
                                ? "destructive"
                                : "outline"
                            }
                            className={cn(
                              "w-full h-9 rounded-sm",
                              general.templateId === template.id
                                ? "bg-red-500 hover:bg-red-600 text-white border-transparent"
                                : "border-[#1ea1f2] text-[#1ea1f2] hover:bg-blue-50",
                            )}
                          >
                            {general.templateId === template.id ? (
                              <>
                                <X className="w-4 h-4 mr-2" /> Remove
                              </>
                            ) : (
                              "Apply Template"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-md">
                    <p className="text-slate-500 font-medium">
                      No templates found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
