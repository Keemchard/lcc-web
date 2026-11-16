import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";
import { logChange, computeChanges } from "@/lib/firestore/changeHistory";
import { FieldValue } from "firebase-admin/firestore";
import { del } from "@vercel/blob";

export async function PUT(
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
    const docRef = adminDb.collection("carouselSlides").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    const beforeData = existing.data() as Record<string, unknown>;
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    const fields = ["imageUrl", "title", "details", "time", "order"] as const;
    for (const field of fields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await docRef.update(updateData);

    const changes = computeChanges(beforeData, updateData);
    await logChange({
      entityType: "carouselSlide",
      entityId: id,
      entityTitle: body.title ?? beforeData.title as string,
      action: "update",
      changes,
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update slide";
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
    const docRef = adminDb.collection("carouselSlides").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    const data = existing.data()!;
    const imageUrl = data.imageUrl as string;

    if (imageUrl) {
      await del(imageUrl).catch(() => {});
    }

    await docRef.delete();

    await logChange({
      entityType: "carouselSlide",
      entityId: id,
      entityTitle: data.title as string,
      action: "delete",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete slide";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
