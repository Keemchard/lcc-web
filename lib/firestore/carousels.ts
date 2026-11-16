import { adminDb } from "@/lib/firebase/admin";
import type { SerializedCarouselSlide } from "@/types";

export async function getCarouselSlides(): Promise<SerializedCarouselSlide[]> {
  if (!adminDb) return [];

  const snapshot = await adminDb
    .collection("carouselSlides")
    .orderBy("order")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      imageUrl: data.imageUrl,
      title: data.title,
      details: data.details,
      time: data.time,
      order: data.order,
    };
  });
}
