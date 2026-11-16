import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await adminDb
      .collection("changeHistory")
      .orderBy("performedAt", "desc")
      .limit(50)
      .get();

    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      performedAt: doc.data().performedAt?.toDate?.()?.toISOString() ?? null,
    }));

    return NextResponse.json(entries);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
