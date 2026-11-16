import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UserRole } from "@/types";

const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionCookie(idToken: string) {
  if (!adminAuth) throw new Error("Firebase Admin not configured");
  return adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRY,
  });
}

export async function verifySessionCookie(cookie: string) {
  if (!adminAuth) return null;
  try {
    return await adminAuth.verifySessionCookie(cookie, true);
  } catch {
    return null;
  }
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  if (!adminDb) return null;
  const doc = await adminDb.collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return (doc.data()?.role as UserRole) ?? null;
}
