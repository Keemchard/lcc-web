import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";
import { logChange } from "@/lib/firestore/changeHistory";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  try {
    const snapshot = await adminDb
      .collection("serviceTimes")
      .orderBy("order")
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch service times";
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
    const docRef = await adminDb.collection("serviceTimes").add({
      imageUrl: body.imageUrl,
      title: body.title,
      time: body.time,
      location: body.location,
      speaker: body.speaker,
      ctaLabel: body.ctaLabel,
      ctaHref: body.ctaHref || "",
      order: body.order ?? 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: admin.uid,
    });

    await logChange({
      entityType: "serviceTime",
      entityId: docRef.id,
      entityTitle: body.title,
      action: "create",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create service time";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
