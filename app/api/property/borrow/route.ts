import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";
import { logChange } from "@/lib/firestore/changeHistory";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("borrowRecords").get();
    const records = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
      };
    });
    return NextResponse.json(records);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch records";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const docRef = await adminDb.collection("borrowRecords").add({
      assetId: body.assetId,
      assetName: body.assetName,
      borrower: body.borrower,
      purpose: body.purpose ?? "",
      dateOut: body.dateOut,
      dateReturned: "",
      status: "Borrowed",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: admin.uid,
    });

    await logChange({
      entityType: "borrowRecord",
      entityId: docRef.id,
      entityTitle: `${body.assetName} → ${body.borrower}`,
      action: "create",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
