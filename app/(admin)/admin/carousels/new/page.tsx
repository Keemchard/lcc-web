"use client";

import { FormEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import styles from "../../AdminPages.module.scss";

export default function NewCarouselPage() {
  const router = useRouter();
  const fileRef = useRef<File | null>(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [time, setTime] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileRef.current) {
      setError("Please select an image.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", fileRef.current);
      formData.append("folder", "carousels");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || "Image upload failed");
      }
      const { url: imageUrl } = await uploadRes.json();

      const res = await fetch("/api/carousels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, title, details, time, order }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create slide");
      }

      router.push("/admin/carousels");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Add New Slide</h1>

      <div className={styles.formCard}>
        {error && (
          <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Image</label>
            <ImageUpload onFileSelected={(file) => (fileRef.current = file)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Slide title"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Details</label>
            <textarea
              className={styles.formTextarea}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              placeholder="Slide details"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Time</label>
            <input
              className={styles.formInput}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              placeholder="e.g. Sunday, 8:00 AM"
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
              {loading ? "Saving..." : "Create Slide"}
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
