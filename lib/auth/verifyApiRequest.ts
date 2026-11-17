import { cookies } from "next/headers";
import { verifyToken, getUserRole } from "./session";
import type { AdminUser } from "@/types";

// Cache verified admin for 60 seconds to avoid repeated Firebase + Firestore calls
const verifyCache = new Map<string, { user: AdminUser; expires: number }>();

export async function verifyAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  // Check cache first (use first 20 chars of token as key)
  const cacheKey = session.substring(0, 20);
  const cached = verifyCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.user;
  }

  const decoded = await verifyToken(session);
  if (!decoded) return null;

  const role = await getUserRole(decoded.uid);
  if (role !== "admin" && role !== "supreme_admin") return null;

  const user: AdminUser = { uid: decoded.uid, email: decoded.email || "", role };

  // Cache for 60 seconds
  verifyCache.set(cacheKey, { user, expires: Date.now() + 60_000 });

  // Cleanup old entries
  if (verifyCache.size > 50) {
    const now = Date.now();
    for (const [k, v] of verifyCache) {
      if (v.expires < now) verifyCache.delete(k);
    }
  }

  return user;
}

export async function verifySupremeAdmin(): Promise<AdminUser | null> {
  const admin = await verifyAdmin();
  if (!admin || admin.role !== "supreme_admin") return null;
  return admin;
}
