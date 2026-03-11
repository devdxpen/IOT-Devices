"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GroupDetailsTab } from "@/features/groups/tabs/GroupDetailsTab";
import { LinkedDevicesTab } from "@/features/groups/tabs/LinkedDevicesTab";
import { LinkedAccountTab } from "@/features/groups/tabs/LinkedAccountTab";
import { AlarmsTab } from "@/features/groups/tabs/AlarmsTab";
import { useCreateGroup } from "@/features/groups/hooks/useGroups";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2, ChevronRight } from "lucide-react";
import { Device } from "@/types";
import { GroupUser, GroupAlarm } from "@/types/group";

export default function CreateGroupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateGroup();

  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<GroupUser[]>([]);
  const [selectedAlarms, setSelectedAlarms] = useState<GroupAlarm[]>([]);

  const [activeTab, setActiveTab] = useState("details");
  const [detailsData, setDetailsData] = useState({
    groupName: "",
    description: "",
    status: false,
    activationDate: "",
    endDate: "",
  });

  const tabs = [
    { value: "details", label: "Group Details" },
    { value: "devices", label: "Linked Devices" },
    { value: "accounts", label: "Linked Account & Role Management" },
    { value: "alarms", label: "Alarms" },
  ];

  const currentIndex = tabs.findIndex((t) => t.value === activeTab);

  const handleNext = async () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].value);
    } else {
      // Final step – create the group
      if (!detailsData.groupName.trim()) {
        toast({
          title: "Validation Error",
          description: "Group name is required.",
          variant: "destructive",
        });
        setActiveTab("details");
        return;
      }

      try {
        await createMutation.mutateAsync({
          name: detailsData.groupName,
          description: detailsData.description,
          icon: "general",
          status: detailsData.status ? "active" : "inactive",
          devices: selectedDevices,
          tags: "",
          validityStart: detailsData.activationDate,
          validityEnd: detailsData.endDate,
          alarms: selectedAlarms.length,
        });
        toast({
          title: "Group Created",
          description: `"${detailsData.groupName}" has been created successfully.`,
        });
        router.push("/groups");
      } catch {
        toast({
          title: "Error",
          description: "Failed to create the group.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].value);
    } else {
      router.push("/groups");
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {tabs.map((tab, i) => (
          <div key={tab.value} className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                i === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : i < currentIndex
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold",
                  i === currentIndex
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : i < currentIndex
                      ? "bg-emerald-200 text-emerald-700"
                      : "bg-muted-foreground/20",
                )}
              >
                {i < currentIndex ? "✓" : i + 1}
              </span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
            {i < tabs.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 mx-1" />
            )}
          </div>
        ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="flex-1">
          <div className="bg-card rounded-lg border p-6">
            <TabsContent value="details" className="mt-0">
              <GroupDetailsTab
                mode="create"
                data={detailsData}
                onChange={setDetailsData}
              />
            </TabsContent>
            <TabsContent value="devices" className="mt-0">
              <LinkedDevicesTab
                devices={selectedDevices}
                mode="create"
                onChange={setSelectedDevices}
              />
            </TabsContent>
            <TabsContent value="accounts" className="mt-0">
              <LinkedAccountTab
                users={selectedUsers}
                mode="create"
                onChange={setSelectedUsers}
              />
            </TabsContent>
            <TabsContent value="alarms" className="mt-0">
              <AlarmsTab
                alarms={selectedAlarms}
                mode="create"
                onChange={setSelectedAlarms}
              />
            </TabsContent>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between bg-background rounded-lg mt-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentIndex === 0 ? "Back to Groups" : "Previous Step"}
          </Button>
          <Button onClick={handleNext} disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : currentIndex === tabs.length - 1 ? (
              "Create Group"
            ) : (
              <>
                Next Step
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Tabs>
    </>
  );
}
