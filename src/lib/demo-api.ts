import { readDemoSession } from "@/lib/auth/demo-auth";
import { demoRequestApi } from "@/lib/mock-api/demo-requests";
import type {
  DemoRequestCreateInput,
  DemoRequestStatus,
} from "@/types/demo";

function requireSession() {
  const session = readDemoSession();
  if (!session) {
    throw new Error("Please login to access demo requests.");
  }
  return session;
}

export async function fetchMyDemoRequests() {
  const session = requireSession();
  return demoRequestApi.getMyRequests(session);
}

export async function createDemoRequest(input: DemoRequestCreateInput) {
  const session = requireSession();
  return demoRequestApi.createRequest(session, input);
}

export async function updateDemoRequestStatus(
  requestId: string,
  status: DemoRequestStatus,
) {
  const session = requireSession();
  return demoRequestApi.updateStatus(session, requestId, status);
}
