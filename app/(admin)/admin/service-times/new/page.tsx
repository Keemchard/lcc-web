"use client";

import { FormEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import styles from "../../AdminPages.module.scss";

export default function NewServiceTimePage() {
  const router = useRouter();
  const fileRef = useRef<File | null>(null);
  const [title, setTitle] = useState("");
  const [dayStart, setDayStart] = useState("Sunday");
  const [dayEnd, setDayEnd] = useState("");
  const [timeStart, setTimeStart] = useState("08:00");
  const [timeEnd, setTimeEnd] = useState("");
  const [location, setLocation] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Learn More");
  const [ctaHref, setCtaHref] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DAY_SHORT: Record<string, string> = {
    Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
    Thursday: "Thu", Friday: "Fri", Saturday: "Sat",
  };

  const fmt12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const combinedTime = (() => {
    const hasRange = dayEnd && dayEnd !== dayStart;
    const dayPart = hasRange
      ? `${DAY_SHORT[dayStart]}–${DAY_SHORT[dayEnd]}`
      : dayStart;
    const timePart = timeEnd && timeEnd !== timeStart
      ? `${fmt12(timeStart)}–${fmt12(timeEnd)}`
      : fmt12(timeStart);
    return `${dayPart}, ${timePart}`;
  })();

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
          time: combinedTime,
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
            <label className={styles.formLabel}>Day(s)</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                className={styles.formInput}
                value={dayStart}
                onChange={(e) => setDayStart(e.target.value)}
                style={{ flex: 1 }}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span style={{ fontSize: 13, color: "#728094" }}>to</span>
              <select
                className={styles.formInput}
                value={dayEnd}
                onChange={(e) => setDayEnd(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">Same day</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Time</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className={styles.formInput}
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 13, color: "#728094" }}>to</span>
              <input
                className={styles.formInput}
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                style={{ flex: 1 }}
                placeholder="Optional"
              />
            </div>
            <span style={{ fontSize: 12, color: "#728094", marginTop: 4 }}>
              Preview: {combinedTime}
            </span>
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
