import { authApi } from "@/lib/mock-api/access-control";
import type { DemoAccountPreview, SessionUser } from "@/types/access-control";

export type StoredSession = SessionUser;

export const AUTH_SESSION_KEY = "linkediot_demo_session";
export const AUTH_SESSION_EVENT = "linkediot_auth_session_updated";

export function getDemoAccounts(): DemoAccountPreview[] {
  return authApi.getDemoAccounts();
}

export async function loginDemoAccount(
  loginId: string,
  password: string,
): Promise<StoredSession | null> {
  return authApi.login(loginId, password);
}

export function readDemoSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as Partial<StoredSession>;
    if (
      !parsed ||
      typeof parsed.userId !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.displayName !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.loginId !== "string" ||
      typeof parsed.redirectPath !== "string" ||
      !("companyId" in parsed)
    ) {
      return null;
    }
    return parsed as StoredSession;
  } catch {
    return null;
  }
}

export function saveDemoSession(session: StoredSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function clearDemoSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}
