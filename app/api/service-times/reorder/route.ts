import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";

export async function PATCH(request: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items } = await request.json();
    const batch = adminDb.batch();

    for (const item of items as { id: string; order: number }[]) {
      const ref = adminDb.collection("serviceTimes").doc(item.id);
      batch.update(ref, { order: item.order });
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Reorder failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
