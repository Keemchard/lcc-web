"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const IDLE_TIMEOUT = 30 * 60 * 1000;
const TOKEN_REFRESH = 45 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];

export default function SessionGuard() {
  const router = useRouter();
  const lastActivity = useRef(Date.now());
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const authReady = useRef(false);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  const refreshSession = useCallback(async () => {
    if (!auth) return;
    const user = auth.currentUser;
    if (!user) return;
    try {
      const token = await user.getIdToken(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      if (!res.ok && authReady.current) {
        logout();
      }
    } catch {
      // Don't logout on network errors
    }
  }, [logout]);

  const resetIdleTimer = useCallback(() => {
    lastActivity.current = Date.now();
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (authReady.current) logout();
    }, IDLE_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    if (!auth) return;

    // Wait for Firebase Auth to confirm the user state before doing anything
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        authReady.current = true;
        refreshSession();
        resetIdleTimer();
      } else if (authReady.current) {
        // Only logout if auth was previously ready (not initial null)
        logout();
      }
    });

    const handleActivity = () => {
      if (authReady.current) resetIdleTimer();
    };
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    const tokenInterval = setInterval(() => {
      if (!authReady.current) return;
      const idleTime = Date.now() - lastActivity.current;
      if (idleTime < IDLE_TIMEOUT) {
        refreshSession();
      }
    }, TOKEN_REFRESH);

    return () => {
      unsubscribe();
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      clearInterval(tokenInterval);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [refreshSession, resetIdleTimer, logout]);

  return null;
}
