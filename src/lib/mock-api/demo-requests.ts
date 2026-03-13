import type { SessionUser } from "@/types/access-control";
import type {
  DemoRequest,
  DemoRequestCreateInput,
  DemoRequestStatus,
  DemoRequestSummary,
} from "@/types/demo";

const now = new Date();

function daysAgo(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function delay(ms = 200) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function buildSummary(items: DemoRequest[]): DemoRequestSummary {
  return {
    total: items.length,
    pending: items.filter((item) => item.status === "pending").length,
    completed: items.filter((item) => item.status === "completed").length,
  };
}

let demoRequests: DemoRequest[] = [
  {
    id: "DEM-9001",
    requesterId: "iot-001",
    requesterName: "Raj Patel",
    requesterEmail: "raj.iot@zenith.com",
    reason: "New Project",
    preferredDate: "2024-03-25",
    message: "Need platform overview for upcoming smart building project.",
    status: "completed",
    createdAt: daysAgo(8),
  },
  {
    id: "DEM-9002",
    requesterId: "iot-002",
    requesterName: "Priya Mehta",
    requesterEmail: "priya.iot@zenith.com",
    reason: "Technical Support",
    preferredDate: "2024-03-26",
    message: "Issues with gateway connectivity on site B.",
    status: "pending",
    createdAt: daysAgo(6),
  },
  {
    id: "DEM-9003",
    requesterId: "iot-004",
    requesterName: "Neha Joshi",
    requesterEmail: "neha.iot@aquagrid.com",
    reason: "Feature Upgrade",
    preferredDate: "2024-03-28",
    message: "Want to see the new dashboard analytics in action.",
    status: "scheduled",
    createdAt: daysAgo(4),
  },
];

export const demoRequestApi = {
  async getMyRequests(session: SessionUser) {
    await delay();
    if (session.role !== "iot_user") {
      throw new Error("Only IoT users can access demo requests.");
    }

    const items = demoRequests.filter(
      (item) => item.requesterId === session.userId,
    );
    return {
      requests: items,
      summary: buildSummary(items),
    };
  },

  async createRequest(session: SessionUser, input: DemoRequestCreateInput) {
    await delay();
    if (session.role !== "iot_user") {
      throw new Error("Only IoT users can create demo requests.");
    }

    const newRequest: DemoRequest = {
      id: `DEM-${9000 + demoRequests.length + 1}`,
      requesterId: session.userId,
      requesterName: session.displayName,
      requesterEmail: session.email,
      reason: input.reason,
      preferredDate: input.preferredDate,
      message: input.message,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    demoRequests = [newRequest, ...demoRequests];
    return newRequest;
  },

  async updateStatus(
    session: SessionUser,
    requestId: string,
    status: DemoRequestStatus,
  ) {
    await delay();
    if (session.role !== "iot_user") {
      throw new Error("Only IoT users can manage demo requests.");
    }

    const request = demoRequests.find((item) => item.id === requestId);
    if (!request || request.requesterId !== session.userId) {
      throw new Error("Demo request not found.");
    }

    request.status = status;
    return request;
  },
};
