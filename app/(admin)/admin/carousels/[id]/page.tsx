"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import styles from "../../AdminPages.module.scss";

type Slide = {
  id: string;
  imageUrl: string;
  imagePath?: string;
  title: string;
  details: string;
  time: string;
  order: number;
};

export default function EditCarouselPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const fileRef = useRef<File | null>(null);
  const [slide, setSlide] = useState<Slide | null>(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [time, setTime] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/carousels")
      .then((res) => res.json())
      .then((data: Slide[]) => {
        const found = data.find((s) => s.id === id);
        if (found) {
          setSlide(found);
          setTitle(found.title);
          setDetails(found.details);
          setTime(found.time);
          setOrder(found.order);
        }
        setFetching(false);
      });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl = slide?.imageUrl || "";
      let imagePath = slide?.imagePath || "";

      if (fileRef.current) {
        const formData = new FormData();
        formData.append("file", fileRef.current);
        formData.append("folder", "carousels");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      const res = await fetch(`/api/carousels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, title, details, time, order }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update slide");
      }

      router.push("/admin/carousels");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className={styles.emptyState}>Loading...</div>;
  }

  if (!slide) {
    return <div className={styles.emptyState}>Slide not found.</div>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Edit Slide</h1>

      <div className={styles.formCard}>
        {error && (
          <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Image</label>
            <ImageUpload
              currentImageUrl={slide.imageUrl}
              onFileSelected={(file) => (fileRef.current = file)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Details</label>
            <textarea
              className={styles.formTextarea}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Time</label>
            <input
              className={styles.formInput}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Order</label>
            <input
              className={styles.formInput}
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Update Slide"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push("/admin/carousels")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
