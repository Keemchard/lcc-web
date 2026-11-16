"use client";

import { FormEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import styles from "../../AdminPages.module.scss";

export default function NewServiceTimePage() {
  const router = useRouter();
  const fileRef = useRef<File | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Learn More");
  const [ctaHref, setCtaHref] = useState("");
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
      formData.append("folder", "service-times");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { url: imageUrl } = await uploadRes.json();

      const res = await fetch("/api/service-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          title,
          time,
          location,
          speaker,
          ctaLabel,
          ctaHref: ctaHref || undefined,
          order,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create service time");
      }

      router.push("/admin/service-times");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Add Service Time</h1>

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
              placeholder="e.g. Sunday Service"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Time</label>
            <input
              className={styles.formInput}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              placeholder="e.g. 8:00 AM"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Location</label>
            <input
              className={styles.formInput}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="e.g. LCC Worship Hall"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Speaker</label>
            <input
              className={styles.formInput}
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              required
              placeholder="e.g. Rev. Raffy Salvador"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>CTA Label</label>
            <input
              className={styles.formInput}
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              required
              placeholder="e.g. Learn More"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>CTA Link (optional)</label>
            <input
              className={styles.formInput}
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="e.g. https://meet.google.com/..."
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
              {loading ? "Saving..." : "Create Service Time"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push("/admin/service-times")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
