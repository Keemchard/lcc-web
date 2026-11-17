import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { verifyToken } from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  // Revoke the Firebase token so it can't be reused
  if (session && adminAuth) {
    try {
      const decoded = await verifyToken(session);
      if (decoded) {
        await adminAuth.revokeRefreshTokens(decoded.uid);
      }
    } catch {}
  }

  cookieStore.set("session", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  });

  return NextResponse.json({ success: true });
}
