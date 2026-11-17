"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const TOKEN_REFRESH = 45 * 60 * 1000; // refresh token every 45 min
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];

export default function SessionGuard() {
  const router = useRouter();
  const lastActivity = useRef(Date.now());
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  const refreshSession = useCallback(async () => {
    const user = auth?.currentUser;
    if (!user) {
      logout();
      return;
    }
    try {
      const token = await user.getIdToken(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      if (!res.ok) logout();
    } catch {
      logout();
    }
  }, [logout]);

  const resetIdleTimer = useCallback(() => {
    lastActivity.current = Date.now();
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(logout, IDLE_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    if (!auth) return;

    // Initial session refresh
    refreshSession();

    // Start idle timer
    resetIdleTimer();

    // Listen for user activity
    const handleActivity = () => resetIdleTimer();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    // Refresh token periodically (only if user is active)
    const tokenInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivity.current;
      if (idleTime < IDLE_TIMEOUT) {
        refreshSession();
      }
    }, TOKEN_REFRESH);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      clearInterval(tokenInterval);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [refreshSession, resetIdleTimer]);

  return null;
}
