export type UserRole = "admin" | "company" | "iot_user";

export type DeviceShareRole = "viewer" | "admin";

export interface SessionUser {
  role: UserRole;
  userId: string;
  companyId: string | null;
  displayName: string;
  email: string;
  loginId: string;
  redirectPath: string;
}

export interface AuthAccount {
  id: string;
  role: UserRole;
  loginIds: string[];
  password: string;
  displayName: string;
  email: string;
  userId: string;
  companyId: string | null;
  redirectPath: string;
}

export interface CompanyEntity {
  id: string;
  name: string;
  industry: string;
  location: string;
  subscriptionPlan: "starter" | "growth" | "enterprise";
  createdAt: string;
  lastActiveAt: string;
  monthlyRevenueUsd: number;
}

export interface IoTUserEntity {
  id: string;
  companyId: string;
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  status: "active" | "inactive";
  joinedAt: string;
  renewalDate: string;
  totalUsageHours: number;
  retentionRate: number;
  uptimePercent: number;
  monthlyRevenueUsd: number;
  featureUsage: {
    deviceMonitoring: number;
    reports: number;
    alerts: number;
    dashboardUsage: number;
  };
}

export interface DeviceEntity {
  id: string;
  companyId: string;
  ownerUserId: string;
  name: string;
  serialNumber: string;
  category: string;
  type: "gateway" | "sensor" | "camera" | "controller" | "meter";
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  macAddress: string;
  status: "active" | "inactive" | "faulty" | "disabled";
  location: string;
  bandwidthMbps: number;
  dataUsageGb: number;
  alertsCount: number;
  createdAt: string;
  lastSeenAt: string;
}

export interface DeviceShare {
  id: string;
  companyId: string;
  deviceId: string;
  ownerUserId: string;
  targetUserId: string;
  role: DeviceShareRole;
  sharedAt: string;
}

export interface ShareDeviceInput {
  deviceId: string;
  targetUserId: string;
  role?: DeviceShareRole;
}

export interface UnshareDeviceInput {
  deviceId: string;
  targetUserId: string;
}

export interface DemoAccountPreview {
  role: UserRole;
  displayName: string;
  loginId: string;
  password: string;
}
