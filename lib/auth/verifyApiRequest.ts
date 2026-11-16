import { cookies } from "next/headers";
import { verifyToken, getUserRole } from "./session";
import type { AdminUser } from "@/types";

export async function verifyAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  const decoded = await verifyToken(session);
  if (!decoded) return null;

  const role = await getUserRole(decoded.uid);
  if (role !== "admin" && role !== "supreme_admin") return null;

  return { uid: decoded.uid, email: decoded.email || "", role };
}

export async function verifySupremeAdmin(): Promise<AdminUser | null> {
  const admin = await verifyAdmin();
  if (!admin || admin.role !== "supreme_admin") return null;
  return admin;
}
