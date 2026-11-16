import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UserRole } from "@/types";

export async function verifyToken(token: string) {
  if (!adminAuth) return null;
  try {
    return await adminAuth.verifyIdToken(token);
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
