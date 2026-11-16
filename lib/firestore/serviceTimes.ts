import { adminDb } from "@/lib/firebase/admin";
import type { SerializedServiceTime } from "@/types";

export async function getServiceTimes(): Promise<SerializedServiceTime[]> {
  if (!adminDb) return [];

  const snapshot = await adminDb
    .collection("serviceTimes")
    .orderBy("order")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      imageUrl: data.imageUrl,
      title: data.title,
      time: data.time,
      location: data.location,
      speaker: data.speaker,
      ctaLabel: data.ctaLabel,
      ctaHref: data.ctaHref || undefined,
      order: data.order,
    };
  });
}
