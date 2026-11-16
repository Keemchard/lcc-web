"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import styles from "../../AdminPages.module.scss";

type ServiceTime = {
  id: string;
  imageUrl: string;
  imagePath?: string;
  title: string;
  time: string;
  location: string;
  speaker: string;
  ctaLabel: string;
  ctaHref?: string;
  order: number;
};

export default function EditServiceTimePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const fileRef = useRef<File | null>(null);
  const [service, setService] = useState<ServiceTime | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaHref, setCtaHref] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/service-times")
      .then((res) => res.json())
      .then((data: ServiceTime[]) => {
        const found = data.find((s) => s.id === id);
        if (found) {
          setService(found);
          setTitle(found.title);
          setTime(found.time);
          setLocation(found.location);
          setSpeaker(found.speaker);
          setCtaLabel(found.ctaLabel);
          setCtaHref(found.ctaHref || "");
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
      let imageUrl = service?.imageUrl || "";
      let imagePath = service?.imagePath || "";

      if (fileRef.current) {
        const formData = new FormData();
        formData.append("file", fileRef.current);
        formData.append("folder", "service-times");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      const res = await fetch(`/api/service-times/${id}`, {
        method: "PUT",
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
        throw new Error(data.error || "Failed to update service time");
      }

      router.push("/admin/service-times");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className={styles.emptyState}>Loading...</div>;
  }

  if (!service) {
    return <div className={styles.emptyState}>Service time not found.</div>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Edit Service Time</h1>

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
              currentImageUrl={service.imageUrl}
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
            <label className={styles.formLabel}>Time</label>
            <input
              className={styles.formInput}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Location</label>
            <input
              className={styles.formInput}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Speaker</label>
            <input
              className={styles.formInput}
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>CTA Label</label>
            <input
              className={styles.formInput}
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>CTA Link (optional)</label>
            <input
              className={styles.formInput}
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
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
              {loading ? "Saving..." : "Update Service Time"}
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
