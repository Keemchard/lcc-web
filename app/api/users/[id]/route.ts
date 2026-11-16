import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { verifySupremeAdmin } from "@/lib/auth/verifyApiRequest";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!adminDb || !adminAuth) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifySupremeAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { action } = await request.json();

    const userRef = adminDb.collection("users").doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "approve") {
      await userRef.update({
        role: "admin",
        approvedAt: FieldValue.serverTimestamp(),
        approvedBy: admin.uid,
      });
      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      await userRef.delete();
      await adminAuth.deleteUser(id).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
