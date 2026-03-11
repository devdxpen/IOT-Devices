import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DeviceConfigProvider,
  useDeviceConfig,
} from "../contexts/DeviceConfigContext";
import { DeviceApiTab } from "./tabs/device-api-tab";
import { DeviceFirmwareTab } from "./tabs/device-firmware-tab";
import { DeviceParametersTab } from "./tabs/device-parameters-tab";
import { DeviceSetupTab } from "./tabs/device-setup-tab";
import { DeviceTagsTab } from "./tabs/device-tags-tab";
import { DeviceConnectionTab } from "./tabs/device-connection-tab";
import { DeviceLinkedAccountTab } from "./tabs/device-linked-account-tab";
import { DeviceAlarmsTab } from "./tabs/device-alarms-tab";
import { DeviceImportExportTab } from "./tabs/device-import-export-tab";
import { DeviceBackupTab } from "./tabs/device-backup-tab";
import { cn } from "@/lib/utils";
import { useUserPlan } from "@/contexts/UserPlanContext";

interface DeviceEditTabsProps {
  deviceId: string;
}

export function DeviceEditTabs({ deviceId }: DeviceEditTabsProps) {
  return (
    <DeviceConfigProvider deviceId={deviceId}>
      <DeviceEditTabsInner deviceId={deviceId} />
    </DeviceConfigProvider>
  );
}

function DeviceEditTabsInner({ deviceId }: DeviceEditTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("setup");
  const { config, isLoading, saveAll, isSaving } = useDeviceConfig();
  const { plan, updatePlan } = useUserPlan();

  // If the plan changes to basic and the user is on a pro-only tab, revert to setup
  useEffect(() => {
    if (plan === "basic") {
      const proTabs = [
        "connection",
        "tags",
        "parameters",
        "api",
        "import_export",
      ];
      if (proTabs.includes(activeTab)) {
        setActiveTab("setup");
      }
    }
  }, [plan, activeTab]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-white rounded-md border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#1ea1f2]" />
          <p className="text-slate-500 font-medium">
            Loading Device Configuration...
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center bg-white rounded-md border border-slate-200">
        <p className="text-slate-500 font-medium">
          Device configuration could not be loaded.
        </p>
      </div>
    );
  }

  const isPro = plan === "pro";

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <h1
          className="text-xl font-semibold text-slate-800 flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
          Edit Device{" "}
          <span className="text-slate-500 font-normal">#{deviceId}</span>
        </h1>
        <div className="flex items-center gap-3">
          <Button className="bg-[#1C2C4F] hover:bg-[#152240] text-white h-9 px-6 rounded-sm">
            Import Devices
          </Button>

          {/* Plan Toggle (Mocking Plan Switch) */}
          <div className="flex bg-slate-100 rounded-sm overflow-hidden p-0.5 border border-slate-200">
            <button
              onClick={() => updatePlan("basic")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-sm transition-all outline-none",
                !isPro
                  ? "bg-white shadow-sm text-slate-700"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Basic
            </button>
            <button
              onClick={() => updatePlan("pro")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-sm transition-all outline-none",
                isPro
                  ? "bg-white shadow-sm text-slate-700"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Advance
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex-1 bg-white rounded-sm border border-slate-200 shadow-sm flex flex-col min-h-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col w-full h-full"
        >
          <TabsList className="flex w-full justify-start h-auto p-0 bg-transparent border-b border-slate-200 rounded-none overflow-x-auto pb-0 shrink-0">
            <TabsTrigger
              value="setup"
              className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-5 whitespace-nowrap text-slate-500 hover:text-slate-700"
            >
              Devices Setup
            </TabsTrigger>
            {isPro && (
              <TabsTrigger
                value="connection"
                className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
              >
                Connection
              </TabsTrigger>
            )}
            {isPro && (
              <TabsTrigger
                value="tags"
                className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
              >
                Tags
              </TabsTrigger>
            )}
            {isPro && (
              <TabsTrigger
                value="parameters"
                className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
              >
                Parameters
              </TabsTrigger>
            )}
            <TabsTrigger
              value="linkedaccount"
              className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
            >
              Linked Account & Role Management
            </TabsTrigger>
            <TabsTrigger
              value="alarms"
              className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
            >
              Alarms & Alerts
            </TabsTrigger>
            {isPro && (
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
              >
                API
              </TabsTrigger>
            )}
            {isPro && (
              <TabsTrigger
                value="import_export"
                className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
              >
                Import / Export
              </TabsTrigger>
            )}
            <TabsTrigger
              value="firmware"
              className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
            >
              Firmware
            </TabsTrigger>
            <TabsTrigger
              value="backup"
              className="data-[state=active]:bg-[#1ea1f2] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-transparent py-3 px-4 whitespace-nowrap text-slate-500 hover:text-slate-700"
            >
              Backup
            </TabsTrigger>
          </TabsList>

          <div className="p-6 flex-1 overflow-y-auto">
            <TabsContent value="setup" className="m-0 h-full">
              <DeviceSetupTab />
            </TabsContent>
            {isPro && (
              <TabsContent value="connection" className="m-0 h-full">
                <DeviceConnectionTab />
              </TabsContent>
            )}
            {isPro && (
              <TabsContent value="tags" className="m-0 h-full">
                <DeviceTagsTab />
              </TabsContent>
            )}
            {isPro && (
              <TabsContent value="parameters" className="m-0 h-full">
                <DeviceParametersTab />
              </TabsContent>
            )}
            <TabsContent value="linkedaccount" className="m-0 h-full">
              <DeviceLinkedAccountTab />
            </TabsContent>
            <TabsContent value="alarms" className="m-0 h-full">
              <DeviceAlarmsTab />
            </TabsContent>
            {isPro && (
              <TabsContent value="api" className="m-0 h-full">
                <DeviceApiTab />
              </TabsContent>
            )}
            {isPro && (
              <TabsContent value="import_export" className="m-0 h-full">
                <DeviceImportExportTab />
              </TabsContent>
            )}
            <TabsContent value="firmware" className="m-0 h-full">
              <DeviceFirmwareTab />
            </TabsContent>
            <TabsContent value="backup" className="m-0 h-full">
              <DeviceBackupTab />
            </TabsContent>
          </div>

          <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="h-10 px-8 rounded-sm bg-white border-slate-200"
            >
              Go back
            </Button>
            <Button
              onClick={saveAll}
              disabled={isSaving}
              className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white h-10 px-8 rounded-sm min-w-[124px]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin text-white mr-2" />
              ) : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
