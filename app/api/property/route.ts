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
    const snapshot = await adminDb.collection("propertyItems").get();
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
      };
    });
    return NextResponse.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch items";
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
    const docRef = await adminDb.collection("propertyItems").add({
      name: body.name,
      category: body.category,
      quantity: body.quantity ?? 1,
      condition: body.condition ?? "Good",
      location: body.location ?? "",
      dateAcquired: body.dateAcquired ?? "",
      acquisitionType: body.acquisitionType ?? "Purchased",
      value: body.value ?? 0,
      notes: body.notes ?? "",
      maintenanceHistory: body.maintenanceHistory ?? [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: admin.uid,
    });

    await logChange({
      entityType: "propertyItem",
      entityId: docRef.id,
      entityTitle: body.name,
      action: "create",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
