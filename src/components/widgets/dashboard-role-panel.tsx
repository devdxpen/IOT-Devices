"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Share2, Unplug } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoSession } from "@/hooks/use-demo-session";
import { deviceApi, orgApi, userApi } from "@/lib/mock-api/access-control";

export function DashboardRolePanel() {
  const session = useDemoSession();

  if (!session || session.role === "admin") {
    return null;
  }

  if (session.role === "company") {
    return <CompanyRolePanel />;
  }

  return <IoTUserRolePanel />;
}

function CompanyRolePanel() {
  const session = useDemoSession();

  const companiesQuery = useQuery({
    queryKey: ["company-role-panel", "companies", session?.companyId],
    queryFn: () => orgApi.getCompanies(session!),
    enabled: Boolean(session),
  });

  const usersQuery = useQuery({
    queryKey: ["company-role-panel", "users", session?.companyId],
    queryFn: () => userApi.getIoTUsers(session!, session?.companyId ?? undefined),
    enabled: Boolean(session),
  });

  const devicesQuery = useQuery({
    queryKey: ["company-role-panel", "devices", session?.companyId],
    queryFn: () => deviceApi.getDevices(session!),
    enabled: Boolean(session),
  });

  const company = companiesQuery.data?.[0];
  const users = usersQuery.data ?? [];
  const devices = devicesQuery.data ?? [];

  const ownedDeviceByUser = useMemo(
    () => new Map(devices.map((device) => [device.ownerUserId, device])),
    [devices],
  );

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Company Scope Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Company:</span>{" "}
            {company?.name ?? "Unknown"}
          </p>
          <p>
            <span className="font-medium text-foreground">IoT Users:</span>{" "}
            {users.length}
          </p>
          <p>
            <span className="font-medium text-foreground">Owned Devices:</span>{" "}
            {devices.length}
          </p>
          <p>
            <span className="font-medium text-foreground">Plan:</span>{" "}
            {company?.subscriptionPlan ?? "N/A"}
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle className="text-base">IoT Users Under Company</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owned Device</TableHead>
                <TableHead>Renewal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "outline"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ownedDeviceByUser.get(user.id)?.name ?? "No device assigned"}
                  </TableCell>
                  <TableCell>{new Date(user.renewalDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!users.length && (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                    No IoT users found in this company scope.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

function IoTUserRolePanel() {
  const session = useDemoSession();
  const queryClient = useQueryClient();
  const [targetQuery, setTargetQuery] = useState("");
  const [targetError, setTargetError] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [shareRole, setShareRole] = useState<"viewer" | "admin">("viewer");

  const ownedDeviceQuery = useQuery({
    queryKey: ["iot-role-panel", "owned-device", session?.userId],
    queryFn: () => deviceApi.getOwnedDevice(session!, session!.userId),
    enabled: Boolean(session),
  });

  const sharedDevicesQuery = useQuery({
    queryKey: ["iot-role-panel", "shared-devices", session?.userId],
    queryFn: () => deviceApi.getSharedDevices(session!, session!.userId),
    enabled: Boolean(session),
  });

  const sharesQuery = useQuery({
    queryKey: [
      "iot-role-panel",
      "shares",
      session?.userId,
      ownedDeviceQuery.data?.id ?? "no-device",
    ],
    queryFn: () => deviceApi.getSharesForDevice(session!, ownedDeviceQuery.data!.id),
    enabled: Boolean(session && ownedDeviceQuery.data),
  });

  const targetUserQuery = useQuery({
    queryKey: ["iot-role-panel", "target-search", session?.userId, targetQuery],
    queryFn: () => userApi.searchIoTUser(session!, targetQuery),
    enabled: false,
  });

  const shareMutation = useMutation({
    mutationFn: async (targetUserIdValue: string) => {
      if (!ownedDeviceQuery.data) {
        throw new Error("Owned device not found.");
      }
      return deviceApi.shareDevice(session!, {
        deviceId: ownedDeviceQuery.data.id,
        targetUserId: targetUserIdValue,
        role: shareRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["iot-role-panel", "shares", session?.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["iot-role-panel", "shared-devices", session?.userId],
      });
      setTargetQuery("");
      setTargetUserId(null);
      setTargetError(null);
    },
  });

  const unshareMutation = useMutation({
    mutationFn: (targetUserIdValue: string) =>
      deviceApi.unshareDevice(session!, {
        deviceId: ownedDeviceQuery.data!.id,
        targetUserId: targetUserIdValue,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["iot-role-panel", "shares", session?.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["iot-role-panel", "shared-devices", session?.userId],
      });
    },
  });

  const onFindUser = async () => {
    if (!targetQuery.trim()) {
      return;
    }
    setTargetError(null);
    const result = await targetUserQuery.refetch();
    const user = result.data;

    if (!user) {
      setTargetUserId(null);
      setTargetError("User not found in your company scope.");
      return;
    }

    if (user.id === session?.userId) {
      setTargetUserId(null);
      setTargetError("You cannot share a device with yourself.");
      return;
    }

    setTargetUserId(user.id);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">My Device Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Owned Device:</span>{" "}
            {ownedDeviceQuery.data?.name ?? "Not available"}
          </p>
          <p>
            <span className="font-medium text-foreground">Device ID:</span>{" "}
            {ownedDeviceQuery.data?.id ?? "N/A"}
          </p>
          <p>
            <span className="font-medium text-foreground">Shared To Users:</span>{" "}
            {sharesQuery.data?.length ?? 0}
          </p>
          <p>
            <span className="font-medium text-foreground">Shared With Me:</span>{" "}
            {sharedDevicesQuery.data?.length ?? 0}
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle className="text-base">Direct Device Sharing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <Input
              placeholder="Enter target user email or mobile"
              value={targetQuery}
              onChange={(event) => setTargetQuery(event.target.value)}
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={shareRole}
              onChange={(event) =>
                setShareRole(event.target.value as "viewer" | "admin")
              }
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="button" variant="outline" onClick={onFindUser}>
              Find User
            </Button>
          </div>

          {targetError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {targetError}
            </div>
          )}

          {targetUserQuery.data && targetUserId && (
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="font-medium text-foreground">{targetUserQuery.data.fullName}</p>
                <p className="text-xs text-muted-foreground">{targetUserQuery.data.email}</p>
              </div>
              <Button
                type="button"
                onClick={() => shareMutation.mutate(targetUserId)}
                disabled={shareMutation.isPending}
              >
                {shareMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                Share Device
              </Button>
            </div>
          )}

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shared User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Shared At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sharesQuery.data ?? []).map((share) => (
                  <TableRow key={share.id}>
                    <TableCell>{share.targetUserId}</TableCell>
                    <TableCell className="uppercase">{share.role}</TableCell>
                    <TableCell>{new Date(share.sharedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => unshareMutation.mutate(share.targetUserId)}
                        disabled={unshareMutation.isPending}
                      >
                        <Unplug className="h-4 w-4" />
                        Unshare
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!sharesQuery.data?.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                      No active shares. Share your owned device directly.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
