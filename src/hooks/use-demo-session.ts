"use client";

import { useEffect, useState } from "react";
import {
  AUTH_SESSION_EVENT,
  readDemoSession,
  type StoredSession,
} from "@/lib/auth/demo-auth";

export function useDemoSession() {
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    const syncSession = () => {
      setSession(readDemoSession());
    };

    syncSession();

    window.addEventListener("storage", syncSession);
    window.addEventListener(AUTH_SESSION_EVENT, syncSession as EventListener);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(
        AUTH_SESSION_EVENT,
        syncSession as EventListener,
      );
    };
  }, []);

  return session;
}
