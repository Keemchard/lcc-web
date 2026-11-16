import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

type LogChangeParams = {
  entityType: "carouselSlide" | "serviceTime";
  entityId: string;
  entityTitle: string;
  action: "create" | "update" | "delete";
  changes?: Record<string, { before: unknown; after: unknown }>;
  performedBy: string;
  performedByEmail: string;
};

export async function logChange(params: LogChangeParams) {
  if (!adminDb) return;
  await adminDb.collection("changeHistory").add({
    ...params,
    performedAt: FieldValue.serverTimestamp(),
  });
}

export function computeChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>
) {
  const changes: Record<string, { before: unknown; after: unknown }> = {};
  for (const key of Object.keys(after)) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changes[key] = { before: before[key], after: after[key] };
    }
  }
  return Object.keys(changes).length > 0 ? changes : undefined;
}
