import type {
  AuthAccount,
  CompanyEntity,
  DemoAccountPreview,
  DeviceEntity,
  DeviceShare,
  IoTUserEntity,
  SessionUser,
  ShareDeviceInput,
  UnshareDeviceInput,
} from "@/types/access-control";

const now = new Date();

function daysAgo(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function delay(ms = 250) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const companies: CompanyEntity[] = [
  {
    id: "cmp-zen",
    name: "Zenith Automation",
    industry: "Manufacturing",
    location: "Ahmedabad",
    subscriptionPlan: "enterprise",
    createdAt: daysAgo(520),
    lastActiveAt: daysAgo(0),
    monthlyRevenueUsd: 18300,
  },
  {
    id: "cmp-aqua",
    name: "Aqua Grid",
    industry: "Utilities",
    location: "Surat",
    subscriptionPlan: "growth",
    createdAt: daysAgo(380),
    lastActiveAt: daysAgo(1),
    monthlyRevenueUsd: 12900,
  },
];

const iotUsers: IoTUserEntity[] = [
  {
    id: "iot-001",
    companyId: "cmp-zen",
    username: "raj.iot",
    fullName: "Raj Patel",
    email: "raj.iot@zenith.com",
    mobile: "+91 90000 10001",
    status: "active",
    joinedAt: daysAgo(260),
    renewalDate: daysAgo(-18),
    totalUsageHours: 148.4,
    retentionRate: 89,
    uptimePercent: 97.2,
    monthlyRevenueUsd: 490,
    featureUsage: {
      deviceMonitoring: 84,
      reports: 70,
      alerts: 79,
      dashboardUsage: 88,
    },
  },
  {
    id: "iot-002",
    companyId: "cmp-zen",
    username: "priya.iot",
    fullName: "Priya Mehta",
    email: "priya.iot@zenith.com",
    mobile: "+91 90000 10002",
    status: "active",
    joinedAt: daysAgo(210),
    renewalDate: daysAgo(-9),
    totalUsageHours: 133.1,
    retentionRate: 86,
    uptimePercent: 95.7,
    monthlyRevenueUsd: 460,
    featureUsage: {
      deviceMonitoring: 81,
      reports: 66,
      alerts: 74,
      dashboardUsage: 83,
    },
  },
  {
    id: "iot-003",
    companyId: "cmp-zen",
    username: "kunal.iot",
    fullName: "Kunal Shah",
    email: "kunal.iot@zenith.com",
    mobile: "+91 90000 10003",
    status: "inactive",
    joinedAt: daysAgo(180),
    renewalDate: daysAgo(4),
    totalUsageHours: 72.8,
    retentionRate: 69,
    uptimePercent: 89.4,
    monthlyRevenueUsd: 280,
    featureUsage: {
      deviceMonitoring: 58,
      reports: 44,
      alerts: 47,
      dashboardUsage: 59,
    },
  },
  {
    id: "iot-004",
    companyId: "cmp-aqua",
    username: "neha.iot",
    fullName: "Neha Joshi",
    email: "neha.iot@aquagrid.com",
    mobile: "+91 90000 20001",
    status: "active",
    joinedAt: daysAgo(240),
    renewalDate: daysAgo(-12),
    totalUsageHours: 139.8,
    retentionRate: 88,
    uptimePercent: 96.1,
    monthlyRevenueUsd: 430,
    featureUsage: {
      deviceMonitoring: 83,
      reports: 68,
      alerts: 76,
      dashboardUsage: 85,
    },
  },
  {
    id: "iot-005",
    companyId: "cmp-aqua",
    username: "amit.iot",
    fullName: "Amit Rana",
    email: "amit.iot@aquagrid.com",
    mobile: "+91 90000 20002",
    status: "active",
    joinedAt: daysAgo(165),
    renewalDate: daysAgo(-22),
    totalUsageHours: 156.7,
    retentionRate: 91,
    uptimePercent: 98.0,
    monthlyRevenueUsd: 510,
    featureUsage: {
      deviceMonitoring: 88,
      reports: 72,
      alerts: 81,
      dashboardUsage: 90,
    },
  },
  {
    id: "iot-006",
    companyId: "cmp-aqua",
    username: "divya.iot",
    fullName: "Divya Soni",
    email: "divya.iot@aquagrid.com",
    mobile: "+91 90000 20003",
    status: "inactive",
    joinedAt: daysAgo(130),
    renewalDate: daysAgo(11),
    totalUsageHours: 63.4,
    retentionRate: 65,
    uptimePercent: 86.3,
    monthlyRevenueUsd: 230,
    featureUsage: {
      deviceMonitoring: 52,
      reports: 39,
      alerts: 44,
      dashboardUsage: 57,
    },
  },
];

const deviceTypeCycle: DeviceEntity["type"][] = [
  "gateway",
  "sensor",
  "camera",
  "controller",
  "meter",
];

const devices: DeviceEntity[] = iotUsers.map((user, index) => {
  const company = companies.find((entry) => entry.id === user.companyId);
  const type = deviceTypeCycle[index % deviceTypeCycle.length];
  const status: DeviceEntity["status"] =
    index % 5 === 0 ? "faulty" : index % 4 === 0 ? "inactive" : "active";

  return {
    id: `dev-${String(index + 1).padStart(3, "0")}`,
    companyId: user.companyId,
    ownerUserId: user.id,
    name: `${company?.name ?? "Company"} Device ${index + 1}`,
    serialNumber: `SER-${String(10000 + index * 113)}`,
    category: type.charAt(0).toUpperCase() + type.slice(1),
    type,
    manufacturer: ["Cisco", "Siemens", "Honeywell", "Bosch", "Schneider"][
      index % 5
    ],
    model: ["IR1101", "SITRANS", "HC900", "BME688", "PM5000"][index % 5],
    firmwareVersion: `v${2 + (index % 4)}.${index % 10}.${(index * 3) % 10}`,
    macAddress: `AA:BB:CC:DD:EE:${(10 + index).toString(16).toUpperCase()}`,
    status,
    location: company?.location ?? "Unknown",
    bandwidthMbps: 52 + index * 7,
    dataUsageGb: 290 + index * 55,
    alertsCount: status === "faulty" ? 9 : status === "inactive" ? 4 : 1,
    createdAt: daysAgo(290 - index * 17),
    lastSeenAt: daysAgo(status === "inactive" ? 5 : 0),
  };
});

let deviceShares: DeviceShare[] = [
  {
    id: "share-001",
    companyId: "cmp-zen",
    deviceId: "dev-001",
    ownerUserId: "iot-001",
    targetUserId: "iot-002",
    role: "viewer",
    sharedAt: daysAgo(35),
  },
  {
    id: "share-002",
    companyId: "cmp-aqua",
    deviceId: "dev-005",
    ownerUserId: "iot-005",
    targetUserId: "iot-004",
    role: "admin",
    sharedAt: daysAgo(19),
  },
];

const authAccounts: AuthAccount[] = [
  {
    id: "auth-admin-1",
    role: "admin",
    loginIds: ["admin", "admin@linkediot.com"],
    password: "Admin@123",
    displayName: "Platform Admin",
    email: "admin@linkediot.com",
    userId: "admin-001",
    companyId: null,
    redirectPath: "/admin/home",
  },
  {
    id: "auth-company-1",
    role: "company",
    loginIds: ["company.zen", "zen@company.com"],
    password: "Company@123",
    displayName: "Zenith Company Admin",
    email: "zen@company.com",
    userId: "cmp-admin-zen",
    companyId: "cmp-zen",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-company-2",
    role: "company",
    loginIds: ["company.aqua", "aqua@company.com"],
    password: "Company@123",
    displayName: "Aqua Company Admin",
    email: "aqua@company.com",
    userId: "cmp-admin-aqua",
    companyId: "cmp-aqua",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-iot-1",
    role: "iot_user",
    loginIds: ["iot.raj", "raj.iot@zenith.com"],
    password: "Iot@123",
    displayName: "Raj Patel",
    email: "raj.iot@zenith.com",
    userId: "iot-001",
    companyId: "cmp-zen",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-iot-2",
    role: "iot_user",
    loginIds: ["iot.priya", "priya.iot@zenith.com"],
    password: "Iot@123",
    displayName: "Priya Mehta",
    email: "priya.iot@zenith.com",
    userId: "iot-002",
    companyId: "cmp-zen",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-iot-3",
    role: "iot_user",
    loginIds: ["iot.kunal", "kunal.iot@zenith.com"],
    password: "Iot@123",
    displayName: "Kunal Shah",
    email: "kunal.iot@zenith.com",
    userId: "iot-003",
    companyId: "cmp-zen",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-iot-4",
    role: "iot_user",
    loginIds: ["iot.neha", "neha.iot@aquagrid.com"],
    password: "Iot@123",
    displayName: "Neha Joshi",
    email: "neha.iot@aquagrid.com",
    userId: "iot-004",
    companyId: "cmp-aqua",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-iot-5",
    role: "iot_user",
    loginIds: ["iot.amit", "amit.iot@aquagrid.com"],
    password: "Iot@123",
    displayName: "Amit Rana",
    email: "amit.iot@aquagrid.com",
    userId: "iot-005",
    companyId: "cmp-aqua",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-iot-6",
    role: "iot_user",
    loginIds: ["iot.divya", "divya.iot@aquagrid.com"],
    password: "Iot@123",
    displayName: "Divya Soni",
    email: "divya.iot@aquagrid.com",
    userId: "iot-006",
    companyId: "cmp-aqua",
    redirectPath: "/dashboard",
  },
  {
    id: "auth-iot-7",
    role: "iot_user",
    loginIds: ["iot.nora", "nora.lin@fieldops.io"],
    password: "Iot@123",
    displayName: "Nora Lin",
    email: "nora.lin@fieldops.io",
    userId: "iot-independent-001",
    companyId: null,
    redirectPath: "/dashboard",
  },
];

function ensureSession(session: SessionUser | null | undefined): SessionUser {
  if (!session) {
    throw new Error("Please login to access this data.");
  }
  return session;
}

function allowedCompanyIds(session: SessionUser): Set<string> {
  if (session.role === "admin") {
    return new Set(companies.map((company) => company.id));
  }
  if (!session.companyId) {
    return new Set<string>();
  }
  return new Set([session.companyId]);
}

function canReadIoTUser(session: SessionUser, userId: string) {
  if (session.role === "admin") {
    return true;
  }
  if (session.role === "company") {
    return iotUsers.some(
      (user) => user.id === userId && user.companyId === session.companyId,
    );
  }
  return session.userId === userId;
}

export const authApi = {
  getDemoAccounts(): DemoAccountPreview[] {
    return authAccounts.map((account) => ({
      role: account.role,
      displayName: account.displayName,
      loginId: account.loginIds[0],
      password: account.password,
    }));
  },

  async login(loginId: string, password: string): Promise<SessionUser | null> {
    await delay();
    const normalizedLogin = loginId.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const account =
      authAccounts.find(
        (item) =>
          item.loginIds.includes(normalizedLogin) &&
          item.password === normalizedPassword,
      ) ?? null;

    if (!account) {
      return null;
    }

    return {
      role: account.role,
      userId: account.userId,
      companyId: account.companyId,
      displayName: account.displayName,
      email: account.email,
      loginId: normalizedLogin,
      redirectPath: account.redirectPath,
    };
  },
};

export const orgApi = {
  async getCompanies(session: SessionUser): Promise<CompanyEntity[]> {
    await delay();
    const safeSession = ensureSession(session);
    const companyIds = allowedCompanyIds(safeSession);
    return clone(companies.filter((company) => companyIds.has(company.id)));
  },
};

export const userApi = {
  async getIoTUsers(
    session: SessionUser,
    companyId?: string,
  ): Promise<IoTUserEntity[]> {
    await delay();
    const safeSession = ensureSession(session);
    const companyIds = allowedCompanyIds(safeSession);
    const effectiveCompanyId = companyId ?? safeSession.companyId;

    return clone(
      iotUsers.filter((user) => {
        if (!companyIds.has(user.companyId)) {
          return false;
        }
        if (effectiveCompanyId && user.companyId !== effectiveCompanyId) {
          return false;
        }
        if (safeSession.role === "iot_user") {
          return user.id === safeSession.userId;
        }
        return true;
      }),
    );
  },

  async searchIoTUser(
    session: SessionUser,
    query: string,
  ): Promise<IoTUserEntity | null> {
    await delay(180);
    const safeSession = ensureSession(session);
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return null;
    }

    const companyIds = allowedCompanyIds(safeSession);
    const found =
      iotUsers.find((user) => {
        if (!companyIds.has(user.companyId)) {
          return false;
        }
        return (
          user.email.toLowerCase() === normalized ||
          user.mobile.replace(/\s/g, "") === normalized.replace(/\s/g, "")
        );
      }) ?? null;

    return clone(found);
  },
};

export const deviceApi = {
  async getDevices(session: SessionUser): Promise<DeviceEntity[]> {
    await delay();
    const safeSession = ensureSession(session);

    if (safeSession.role === "iot_user") {
      const owned = devices.filter((device) => device.ownerUserId === safeSession.userId);
      const sharedIds = new Set(
        deviceShares
          .filter((share) => share.targetUserId === safeSession.userId)
          .map((share) => share.deviceId),
      );
      const shared = devices.filter((device) => sharedIds.has(device.id));
      return clone([...owned, ...shared]);
    }

    const companyIds = allowedCompanyIds(safeSession);
    return clone(devices.filter((device) => companyIds.has(device.companyId)));
  },

  async getOwnedDevice(
    session: SessionUser,
    iotUserId: string,
  ): Promise<DeviceEntity | null> {
    await delay();
    const safeSession = ensureSession(session);
    if (!canReadIoTUser(safeSession, iotUserId)) {
      throw new Error("You do not have access to this IoT user.");
    }
    const owned = devices.find((device) => device.ownerUserId === iotUserId) ?? null;
    return clone(owned);
  },

  async getSharedDevices(
    session: SessionUser,
    iotUserId: string,
  ): Promise<DeviceEntity[]> {
    await delay();
    const safeSession = ensureSession(session);
    if (!canReadIoTUser(safeSession, iotUserId)) {
      throw new Error("You do not have access to this IoT user.");
    }
    const shareDeviceIds = new Set(
      deviceShares
        .filter((share) => share.targetUserId === iotUserId)
        .map((share) => share.deviceId),
    );
    return clone(devices.filter((device) => shareDeviceIds.has(device.id)));
  },

  async getSharesForDevice(
    session: SessionUser,
    deviceId: string,
  ): Promise<DeviceShare[]> {
    await delay(180);
    const safeSession = ensureSession(session);
    const device = devices.find((entry) => entry.id === deviceId);
    if (!device) {
      throw new Error("Device not found.");
    }
    if (safeSession.role === "iot_user" && device.ownerUserId !== safeSession.userId) {
      throw new Error("Only device owner can inspect share list.");
    }
    if (
      safeSession.role === "company" &&
      safeSession.companyId !== device.companyId
    ) {
      throw new Error("Company access denied.");
    }
    return clone(deviceShares.filter((share) => share.deviceId === deviceId));
  },

  async shareDevice(
    session: SessionUser,
    input: ShareDeviceInput,
  ): Promise<DeviceShare> {
    await delay(220);
    const safeSession = ensureSession(session);
    const device = devices.find((entry) => entry.id === input.deviceId);
    if (!device) {
      throw new Error("Device not found.");
    }
    if (safeSession.role !== "iot_user") {
      throw new Error("Only IoT user can directly share a device.");
    }
    if (device.ownerUserId !== safeSession.userId) {
      throw new Error("You can only share your owned device.");
    }
    const targetUser = iotUsers.find((user) => user.id === input.targetUserId);
    if (!targetUser) {
      throw new Error("Target IoT user not found.");
    }
    if (targetUser.companyId !== device.companyId) {
      throw new Error("Device can only be shared within same company.");
    }
    if (targetUser.id === safeSession.userId) {
      throw new Error("Cannot share device with yourself.");
    }

    const existingShare = deviceShares.find(
      (share) =>
        share.deviceId === input.deviceId &&
        share.targetUserId === input.targetUserId,
    );
    if (existingShare) {
      existingShare.role = input.role ?? existingShare.role;
      return clone(existingShare);
    }

    const newShare: DeviceShare = {
      id: `share-${Date.now()}`,
      companyId: device.companyId,
      deviceId: device.id,
      ownerUserId: safeSession.userId,
      targetUserId: targetUser.id,
      role: input.role ?? "viewer",
      sharedAt: new Date().toISOString(),
    };
    deviceShares = [newShare, ...deviceShares];
    return clone(newShare);
  },

  async unshareDevice(
    session: SessionUser,
    input: UnshareDeviceInput,
  ): Promise<void> {
    await delay(220);
    const safeSession = ensureSession(session);
    const device = devices.find((entry) => entry.id === input.deviceId);
    if (!device) {
      throw new Error("Device not found.");
    }
    if (safeSession.role !== "iot_user" || device.ownerUserId !== safeSession.userId) {
      throw new Error("Only device owner can unshare.");
    }
    deviceShares = deviceShares.filter(
      (share) =>
        !(
          share.deviceId === input.deviceId &&
          share.targetUserId === input.targetUserId
        ),
    );
  },
};

export const snapshotApi = {
  getDataset() {
    return {
      companies: clone(companies),
      iotUsers: clone(iotUsers),
      devices: clone(devices),
      deviceShares: clone(deviceShares),
    };
  },

  getScopedDataset(session: SessionUser) {
    const safeSession = ensureSession(session);
    const companyIds = allowedCompanyIds(safeSession);
    const scopedCompanies = companies.filter((company) => companyIds.has(company.id));
    const scopedUsers = iotUsers.filter((user) => companyIds.has(user.companyId));

    if (safeSession.role === "iot_user") {
      const ownedDevices = devices.filter(
        (device) => device.ownerUserId === safeSession.userId,
      );
      const sharedDeviceIds = new Set(
        deviceShares
          .filter((share) => share.targetUserId === safeSession.userId)
          .map((share) => share.deviceId),
      );
      const scopedDevices = devices.filter(
        (device) =>
          ownedDevices.some((owned) => owned.id === device.id) ||
          sharedDeviceIds.has(device.id),
      );

      const scopedShares = deviceShares.filter(
        (share) =>
          share.ownerUserId === safeSession.userId ||
          share.targetUserId === safeSession.userId,
      );

      return {
        companies: clone(scopedCompanies),
        iotUsers: clone(scopedUsers.filter((user) => user.id === safeSession.userId)),
        devices: clone(scopedDevices),
        deviceShares: clone(scopedShares),
      };
    }

    return {
      companies: clone(scopedCompanies),
      iotUsers: clone(scopedUsers),
      devices: clone(devices.filter((device) => companyIds.has(device.companyId))),
      deviceShares: clone(
        deviceShares.filter((share) => companyIds.has(share.companyId)),
      ),
    };
  },
};
