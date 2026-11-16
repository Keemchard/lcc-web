import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdmin } from "@/lib/auth/verifyApiRequest";
import { logChange } from "@/lib/firestore/changeHistory";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const year = searchParams.get("year");

    let query: FirebaseFirestore.Query = adminDb.collection("financeReports");

    if (type) {
      query = query.where("type", "==", type);
    }
    if (year) {
      query = query.where("year", "==", Number(year));
    }

    const snapshot = await query.get();

    const reports = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json(reports);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch reports";
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

    const docRef = await adminDb.collection("financeReports").add({
      type: body.type,
      month: body.month,
      year: body.year,
      balanceForwarded: body.balanceForwarded ?? 0,
      incomeEntries: body.incomeEntries ?? [],
      additionalIncome: body.additionalIncome ?? [],
      disbursements: body.disbursements ?? [],
      preparedBy: body.preparedBy ?? { name: "", title: "" },
      attestedBy: body.attestedBy ?? { name: "", title: "" },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: admin.uid,
    });

    const title = `${body.type === "receipts" ? "Receipts & Disbursements" : "Church Building Offering"} — ${body.month + 1}/${body.year}`;

    await logChange({
      entityType: "financeReport",
      entityId: docRef.id,
      entityTitle: title,
      action: "create",
      performedBy: admin.uid,
      performedByEmail: admin.email,
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
