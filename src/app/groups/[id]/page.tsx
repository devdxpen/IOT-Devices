"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupDetailsTab } from "@/features/groups/tabs/GroupDetailsTab";
import { LinkedDevicesTab } from "@/features/groups/tabs/LinkedDevicesTab";
import { LinkedAccountTab } from "@/features/groups/tabs/LinkedAccountTab";
import { AlarmsTab } from "@/features/groups/tabs/AlarmsTab";
import { useGroup, useUpdateGroup } from "@/features/groups/hooks/useGroups";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Save,
  Loader2,
  Shield,
  Zap,
  Thermometer,
  Wifi,
  Box,
} from "lucide-react";
import { Device } from "@/types";
import { GroupUser, GroupAlarm } from "@/types/group";

const iconMap: Record<string, React.ReactNode> = {
  security: <Shield className="h-5 w-5" />,
  power: <Zap className="h-5 w-5" />,
  environmental: <Thermometer className="h-5 w-5" />,
  network: <Wifi className="h-5 w-5" />,
  general: <Box className="h-5 w-5" />,
};

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const isEditMode = pathname.endsWith("/edit");
  const mode = isEditMode ? "edit" : "view";

  const { data, isLoading, error } = useGroup(id);
  const updateMutation = useUpdateGroup();

  const [activeTab, setActiveTab] = useState("details");
  const [detailsData, setDetailsData] = useState<{
    groupName: string;
    description: string;
    status: boolean;
    activationDate: string;
    endDate: string;
  } | null>(null);

  const [editedDevices, setEditedDevices] = useState<Device[] | null>(null);
  const [editedUsers, setEditedUsers] = useState<GroupUser[] | null>(null);
  const [editedAlarms, setEditedAlarms] = useState<GroupAlarm[] | null>(null);

  // Seed form data when group loads
  useEffect(() => {
    if (data?.group && !detailsData) {
      const g = data.group;
      setDetailsData({
        groupName: g.name,
        description: g.description ?? "",
        status: g.status === "active",
        activationDate: g.validityStart,
        endDate: g.validityEnd,
      });
      setEditedDevices(g.devices);
      setEditedUsers(data.users);
      setEditedAlarms(data.alarms);
    }
  }, [data, detailsData]);

  const tabs = [
    { value: "details", label: "Group Details" },
    { value: "devices", label: "Linked Devices" },
    { value: "accounts", label: "Linked Account & Role Management" },
    { value: "alarms", label: "Alarms" },
  ];

  const handleSave = async () => {
    if (!id || !detailsData || !editedDevices) return;
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: detailsData.groupName,
          description: detailsData.description,
          status: detailsData.status ? "active" : "inactive",
          validityStart: detailsData.activationDate,
          validityEnd: detailsData.endDate,
          devices: editedDevices,
          deviceCount: editedDevices.length,
          alarms: editedAlarms?.length || 0,
        },
      });
      toast({
        title: "Group Updated",
        description: "Changes saved successfully.",
      });
      router.push(`/groups/${id}`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-destructive">
            Group not found
          </p>
          <p className="text-sm text-muted-foreground">
            The group you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button onClick={() => router.push("/groups")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  const { group, users, alarms } = data;

  return (
    <>
      {/* Group Header Bar */}
      <div className="border-b bg-card rounded-lg border px-6 py-4 -mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => router.push("/groups")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
              {iconMap[group.icon] ?? iconMap.general}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{group.name}</h2>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs capitalize",
                    group.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-orange-50 text-orange-700 border-orange-200",
                  )}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full mr-1 ${group.status === "active" ? "bg-emerald-500" : "bg-orange-400"}`}
                  />
                  {group.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {group.deviceCount} devices · {group.activeUsers} users · Last
                updated {group.lastUpdated}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode === "view" ? (
              <Button
                onClick={() => router.push(`/groups/${id}/edit`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" /> Edit Group
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/groups/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="gap-2"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b">
          <TabsList className="bg-transparent h-auto p-0 gap-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-t-lg data-[state=active]:shadow-none",
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 pt-4">
          <div className="bg-card rounded-lg border p-6">
            <TabsContent value="details" className="mt-0">
              <GroupDetailsTab
                mode={mode}
                data={detailsData ?? undefined}
                onChange={setDetailsData}
              />
            </TabsContent>
            <TabsContent value="devices" className="mt-0">
              <LinkedDevicesTab
                devices={editedDevices || group.devices}
                mode={mode}
                onChange={(devices) => setEditedDevices(devices)}
              />
            </TabsContent>
            <TabsContent value="accounts" className="mt-0">
              <LinkedAccountTab
                users={editedUsers || users}
                mode={mode}
                onChange={(users) => setEditedUsers(users)}
              />
            </TabsContent>
            <TabsContent value="alarms" className="mt-0">
              <AlarmsTab
                alarms={editedAlarms || alarms}
                mode={mode}
                onChange={(alarms) => setEditedAlarms(alarms)}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
}
