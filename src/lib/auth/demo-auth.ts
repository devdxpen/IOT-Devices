export type UserRole = "admin" | "customer";

export interface DemoAccount {
  role: UserRole;
  label: string;
  loginIds: string[];
  password: string;
  name: string;
  email: string;
  redirectPath: string;
}

export interface StoredSession {
  role: UserRole;
  name: string;
  email: string;
  loginId: string;
  redirectPath: string;
}

export const AUTH_SESSION_KEY = "linkediot_demo_session";
export const AUTH_SESSION_EVENT = "linkediot_auth_session_updated";

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "admin",
    label: "Admin",
    loginIds: ["admin", "admin@linkediot.com"],
    password: "Admin@123",
    name: "Admin Portal",
    email: "admin@linkediot.com",
    redirectPath: "/admin/home",
  },
  {
    role: "customer",
    label: "Customer",
    loginIds: ["customer", "customer@linkediot.com"],
    password: "Customer@123",
    name: "Customer User",
    email: "customer@linkediot.com",
    redirectPath: "/",
  },
];

export function resolveDemoAccount(
  loginId: string,
  password: string,
): DemoAccount | null {
  const normalizedLoginId = loginId.trim().toLowerCase();
  const normalizedPassword = password.trim();

  return (
    DEMO_ACCOUNTS.find(
      (account) =>
        account.loginIds.includes(normalizedLoginId) &&
        account.password === normalizedPassword,
    ) ?? null
  );
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
    return JSON.parse(rawSession) as StoredSession;
  } catch {
    return null;
  }
}

export function saveDemoSession(account: DemoAccount, loginId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const sessionData: StoredSession = {
    role: account.role,
    name: account.name,
    email: account.email,
    redirectPath: account.redirectPath,
    loginId: loginId.trim().toLowerCase(),
  };

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function clearDemoSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}
