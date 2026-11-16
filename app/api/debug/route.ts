import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function GET() {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  return NextResponse.json({
    hasEnvVar: !!envKey,
    envVarLength: envKey?.length ?? 0,
    envVarStart: envKey?.substring(0, 20) ?? "missing",
    adminAuthReady: !!adminAuth,
    adminDbReady: !!adminDb,
  });
}
