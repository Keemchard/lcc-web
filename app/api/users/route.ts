import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifySupremeAdmin } from "@/lib/auth/verifyApiRequest";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifySupremeAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
      approvedAt: doc.data().approvedAt?.toDate?.()?.toISOString() ?? null,
    }));

    return NextResponse.json(users);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
