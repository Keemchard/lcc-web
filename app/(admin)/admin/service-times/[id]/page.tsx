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
  const [dayStart, setDayStart] = useState("Sunday");
  const [dayEnd, setDayEnd] = useState("");
  const [timeStart, setTimeStart] = useState("08:00");
  const [timeEnd, setTimeEnd] = useState("");
  const [location, setLocation] = useState("");

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DAY_SHORT: Record<string, string> = {
    Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
    Thursday: "Thu", Friday: "Fri", Saturday: "Sat",
  };
  const SHORT_TO_FULL: Record<string, string> = {
    Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
    Thu: "Thursday", Fri: "Friday", Sat: "Saturday",
  };

  const fmt12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const parse12to24 = (hStr: string, mStr: string, period: string) => {
    let h = parseInt(hStr);
    if (period.toUpperCase() === "PM" && h !== 12) h += 12;
    if (period.toUpperCase() === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${mStr}`;
  };

  const parseTimeString = (timeStr: string) => {
    // "Thu–Sat, 2:00–6:00 PM" or "Saturday, 4:00 AM"
    const rangeMatch = timeStr.match(/^(\w+)–(\w+),\s*(\d{1,2}):(\d{2})\s*(AM|PM)–(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (rangeMatch) {
      const [, ds, de, h1, m1, p1, h2, m2, p2] = rangeMatch;
      setDayStart(SHORT_TO_FULL[ds] || ds);
      setDayEnd(SHORT_TO_FULL[de] || de);
      setTimeStart(parse12to24(h1, m1, p1));
      setTimeEnd(parse12to24(h2, m2, p2));
      return;
    }
    // "Thu–Sat, 2:00 PM" (range days, single time)
    const rangeDayMatch = timeStr.match(/^(\w+)–(\w+),\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (rangeDayMatch) {
      const [, ds, de, h1, m1, p1] = rangeDayMatch;
      setDayStart(SHORT_TO_FULL[ds] || ds);
      setDayEnd(SHORT_TO_FULL[de] || de);
      setTimeStart(parse12to24(h1, m1, p1));
      return;
    }
    // "Saturday, 4:00–5:30 AM" (single day, time range)
    const timeRangeMatch = timeStr.match(/^(\w+),\s*(\d{1,2}):(\d{2})–(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (timeRangeMatch) {
      const [, d, h1, m1, h2, m2, p] = timeRangeMatch;
      setDayStart(SHORT_TO_FULL[d] || d);
      setTimeStart(parse12to24(h1, m1, p));
      setTimeEnd(parse12to24(h2, m2, p));
      return;
    }
    // "Saturday, 4:00 AM" (single day, single time)
    const singleMatch = timeStr.match(/^(\w+),\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (singleMatch) {
      const [, d, h1, m1, p1] = singleMatch;
      setDayStart(SHORT_TO_FULL[d] || d);
      setTimeStart(parse12to24(h1, m1, p1));
      return;
    }
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
          if (found.time) parseTimeString(found.time);
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
