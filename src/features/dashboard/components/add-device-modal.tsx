import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddDeviceManualForm } from "./add-device-manual-form";
import { AddDeviceTemplateForm } from "./add-device-template-form";
import { Edit3, Search } from "lucide-react";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDeviceModal({
  isOpen,
  onClose,
  onSuccess,
}: AddDeviceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-sm">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-normal text-slate-800">
              Add New Device
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4 bg-[#fcfcfc]">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="flex w-full justify-start mb-6 h-auto p-0 bg-transparent border-b border-slate-100 rounded-none">
              <TabsTrigger
                value="manual"
                className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white data-[state=active]:border-transparent border border-transparent rounded-sm text-slate-500 font-normal px-6 py-2 transition-colors mr-2"
              >
                Manual Input
              </TabsTrigger>
              <TabsTrigger
                value="template"
                className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white data-[state=active]:border-transparent border border-transparent rounded-sm text-slate-500 font-normal px-6 py-2 transition-colors"
              >
                Template Search
              </TabsTrigger>
            </TabsList>

            <div className="bg-[#fcfcfc]">
              <TabsContent value="manual" className="mt-0 outline-none p-2">
                <AddDeviceManualForm onSuccess={onSuccess} onClose={onClose} />
              </TabsContent>
              <TabsContent value="template" className="mt-0 outline-none p-2">
                <AddDeviceTemplateForm
                  onSuccess={onSuccess}
                  onClose={onClose}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
