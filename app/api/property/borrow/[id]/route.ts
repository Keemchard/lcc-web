import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";
import { logChange } from "@/lib/firestore/changeHistory";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const docRef = adminDb.collection("borrowRecords").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const data = existing.data()!;
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.dateReturned !== undefined) updateData.dateReturned = body.dateReturned;
    if (body.status !== undefined) updateData.status = body.status;

    await docRef.update(updateData);

    await logChange({
      entityType: "borrowRecord",
      entityId: id,
      entityTitle: `${data.assetName} → ${data.borrower}`,
      action: "update",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const docRef = adminDb.collection("borrowRecords").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const data = existing.data()!;
    await docRef.delete();

    await logChange({
      entityType: "borrowRecord",
      entityId: id,
      entityTitle: `${data.assetName} → ${data.borrower}`,
      action: "delete",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
