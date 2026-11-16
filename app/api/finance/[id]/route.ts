import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";
import { logChange, computeChanges } from "@/lib/firestore/changeHistory";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
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
    const doc = await adminDb.collection("financeReports").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const data = doc.data()!;
    return NextResponse.json({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    const docRef = adminDb.collection("financeReports").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const beforeData = existing.data() as Record<string, unknown>;

    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    const fields = [
      "balanceForwarded", "incomeEntries", "additionalIncome",
      "disbursements", "preparedBy", "attestedBy",
    ] as const;

    for (const field of fields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await docRef.update(updateData);

    const title = `${beforeData.type === "receipts" ? "Receipts & Disbursements" : "Church Building Offering"} — ${(beforeData.month as number) + 1}/${beforeData.year}`;

    const changes = computeChanges(beforeData, updateData);
    await logChange({
      entityType: "financeReport",
      entityId: id,
      entityTitle: title,
      action: "update",
      changes,
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update report";
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
    const docRef = adminDb.collection("financeReports").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const data = existing.data()!;
    const title = `${data.type === "receipts" ? "Receipts & Disbursements" : "Church Building Offering"} — ${data.month + 1}/${data.year}`;

    await docRef.delete();

    await logChange({
      entityType: "financeReport",
      entityId: id,
      entityTitle: title,
      action: "delete",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
