"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type FC,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import type { UserRole } from "@/types";

type UserDocClient = {
  email: string;
  displayName: string;
  role: UserRole;
};

type AuthContextValue = {
  user: User | null;
  userDoc: UserDocClient | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isSupremeAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const googleProvider = new GoogleAuthProvider();

async function exchangeTokenForSession(
  idToken: string
): Promise<{ error?: string; userDoc?: UserDocClient }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return { error: "Server error. Please try again." };
    }
    if (!res.ok) return { error: data.error || "Login failed" };
    return { userDoc: data.user };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && db) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserDoc(snap.data() as UserDocClient);
        }
        // Refresh the session cookie with a fresh ID token
        const token = await firebaseUser.getIdToken();
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });
      } else {
        setUserDoc(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      if (!auth) return { error: "Firebase not configured" };
      try {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await credential.user.getIdToken();
        const result = await exchangeTokenForSession(idToken);
        if (result.error) return { error: result.error };
        if (result.userDoc) setUserDoc(result.userDoc);
        return {};
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Login failed";
        return { error: message };
      }
    },
    []
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      displayName: string
    ): Promise<{ error?: string }> => {
      if (!auth || !db) return { error: "Firebase not configured" };
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userRef = doc(db, "users", credential.user.uid);
        await setDoc(userRef, {
          email,
          displayName,
          role: "pending",
          createdAt: Timestamp.now(),
        });
        setUserDoc({ email, displayName, role: "pending" });
        return {};
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Signup failed";
        return { error: message };
      }
    },
    []
  );

  const loginWithGoogle = useCallback(async (): Promise<{
    error?: string;
  }> => {
    if (!auth || !db) return { error: "Firebase not configured" };
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, "users", credential.user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          email: credential.user.email,
          displayName: credential.user.displayName || "Google User",
          role: "pending",
          createdAt: Timestamp.now(),
        });
      }
      const idToken = await credential.user.getIdToken();
      const result = await exchangeTokenForSession(idToken);
      if (result.error) return { error: result.error };
      if (result.userDoc) setUserDoc(result.userDoc);
      return {};
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed";
      return { error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    if (auth) await signOut(auth);
    setUserDoc(null);
  }, []);

  const isAdmin =
    userDoc?.role === "admin" || userDoc?.role === "supreme_admin";
  const isSupremeAdmin = userDoc?.role === "supreme_admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        isAdmin,
        isSupremeAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
