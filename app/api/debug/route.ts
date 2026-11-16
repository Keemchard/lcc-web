import { NextResponse } from "next/server";

export async function GET() {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  const result: Record<string, unknown> = {
    hasEnvVar: !!envKey,
    envVarLength: envKey?.length ?? 0,
    envVarStart: envKey?.substring(0, 30) ?? "missing",
  };

  if (envKey) {
    // Try base64 decode
    try {
      const decoded = Buffer.from(envKey, "base64").toString("utf-8");
      const parsed = JSON.parse(decoded);
      result.base64Works = true;
      result.hasProjectId = !!parsed.project_id;
      result.hasPrivateKey = !!parsed.private_key;
      result.projectId = parsed.project_id;
    } catch (e) {
      result.base64Works = false;
      result.base64Error = e instanceof Error ? e.message : String(e);

      // Try raw JSON
      try {
        const parsed = JSON.parse(envKey);
        result.rawJsonWorks = true;
        result.hasProjectId = !!parsed.project_id;
        result.projectId = parsed.project_id;
      } catch (e2) {
        result.rawJsonWorks = false;
        result.rawJsonError = e2 instanceof Error ? e2.message : String(e2);
      }
    }
  }

  // Try importing admin
  try {
    const { adminAuth, adminDb } = await import("@/lib/firebase/admin");
    result.adminAuthReady = !!adminAuth;
    result.adminDbReady = !!adminDb;
  } catch (e) {
    result.adminImportError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(result);
}
