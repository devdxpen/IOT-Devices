"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Upload, 
  Plus, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Eye,
  Check,
  Edit2
} from "lucide-react";
import { mockTemplates } from "@/data/mockTemplates";
import { cn } from "@/lib/utils";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddDeviceModal({ isOpen, onClose }: AddDeviceModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    brandName: "",
    model: "",
    serialNo: "",
    deviceName: "",
    macAddress: "",
    status: true,
    industry: "",
    category: "",
    description: ""
  });

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      resetModal();
      onClose();
    }, 1500);
  };

  const resetModal = () => {
    setStep(1);
    setFormData({
      brandName: "",
      model: "",
      serialNo: "",
      deviceName: "",
      macAddress: "",
      status: true,
      industry: "",
      category: "",
      description: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && (resetModal(), onClose())}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden bg-white border-none shadow-2xl">
        <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Add New Device</DialogTitle>
          <DialogClose className="rounded-full p-1.5 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </DialogClose>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
            step === 1 ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-400"
          )}>
            <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] border", step === 1 ? "border-white" : "border-slate-300")}>1</span>
            Manual Input
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
            step === 2 ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-400"
          )}>
            <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] border", step === 2 ? "border-white" : "border-slate-300")}>2</span>
            Get Template
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {step === 1 ? (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Brand Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    placeholder="Enter brand name" 
                    value={formData.brandName}
                    onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                    className="h-11 border-slate-200 focus:ring-sky-500 rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Device id / Serial no. <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    placeholder="Enter device id or serial no" 
                    value={formData.serialNo}
                    onChange={(e) => setFormData({...formData, serialNo: e.target.value})}
                    className="h-11 border-slate-200 focus:ring-sky-500 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Device name / Tag</Label>
                  <Input 
                    placeholder="Enter device name or tag" 
                    value={formData.deviceName}
                    onChange={(e) => setFormData({...formData, deviceName: e.target.value})}
                    className="h-11 border-slate-200 focus:ring-sky-500 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Industry</Label>
                  <Select 
                    value={formData.industry}
                    onValueChange={(val) => setFormData({...formData, industry: val})}
                  >
                    <SelectTrigger className="h-11 border-slate-200 focus:ring-sky-500 rounded-lg">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iot">Industrial IoT</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Model <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    placeholder="Enter model" 
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="h-11 border-slate-200 focus:ring-sky-500 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label className="text-sm font-bold text-slate-700">Upload Device Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border-2 border-dashed border-sky-300 bg-sky-50 flex items-center justify-center cursor-pointer hover:bg-sky-100 transition-colors">
                        <Plus className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-orange-100 border border-orange-200 p-1 relative">
                        <img src="/api/placeholder/40/40" alt="Device" className="w-full h-full object-contain" />
                        <div className="absolute -top-1 -right-1 p-0.5 bg-sky-500 rounded-full border border-white">
                          <Edit2 className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-bold text-slate-700">Status</Label>
                    <div className="flex items-center h-10">
                      <Switch 
                        checked={formData.status} 
                        onCheckedChange={(val) => setFormData({...formData, status: val})}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">MAC Address</Label>
                  <Input 
                    placeholder="Enter mac address" 
                    value={formData.macAddress}
                    onChange={(e) => setFormData({...formData, macAddress: e.target.value})}
                    className="h-11 border-slate-200 focus:ring-sky-500 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Device category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className="h-11 border-slate-200 focus:ring-sky-500 rounded-lg">
                      <SelectValue placeholder="Select device category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="gateway">Gateway</SelectItem>
                      <SelectItem value="meter">Meter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="col-span-full space-y-2">
                <Label className="text-sm font-bold text-slate-700">Description</Label>
                <Textarea 
                  placeholder="Enter description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[100px] border-slate-200 focus:ring-sky-500 rounded-lg resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              <Tabs defaultValue="global" className="w-full">
                <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl w-fit mx-auto mb-6">
                  <TabsList className="bg-transparent border-none">
                    <TabsTrigger value="global" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-lg px-8 py-2 font-bold transition-all">Global Template</TabsTrigger>
                    <TabsTrigger value="local" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-lg px-8 py-2 font-bold transition-all">Local Template</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="global" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockTemplates.filter(t => t.source === "global").map((template) => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="local" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {mockTemplates.filter(t => t.source === "local").map((template) => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                    {mockTemplates.filter(t => t.source === "local").length === 0 && (
                      <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">No local templates found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button variant="outline" onClick={step === 1 ? onClose : handleBack} className="h-11 px-8 rounded-lg border-slate-200 text-slate-600 font-bold min-w-[120px]">
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 px-6 rounded-lg border-green-200 bg-green-50 text-green-600 hover:bg-green-100 font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Template
            </Button>
            
            <Button 
              onClick={step === 1 ? handleNext : handleSubmit} 
              disabled={isLoading}
              className="h-11 px-10 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-lg shadow-sky-500/25 min-w-[140px]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                step === 1 ? (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : "Add Device"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TemplateCard({ template }: { template: any }) {
  return (
    <div className="group border border-slate-200 rounded-xl overflow-hidden hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/5 transition-all cursor-pointer bg-white">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={template.coverPage} 
          alt={template.templateName} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <p className="text-white text-xs font-medium flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Click to preview
          </p>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
             <Check className="w-4 h-4 text-sky-500" />
           </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors uppercase tracking-tight">{template.templateName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-slate-500">{template.brandName}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs font-bold text-slate-500">{template.modelNo}</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
          "{template.description}"
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {template.templateTags.map((tag: string, i: number) => (
            <Badge key={i} variant="secondary" className="bg-slate-100 text-secondary-500 border-none text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
