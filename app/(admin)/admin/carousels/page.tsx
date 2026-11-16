"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../AdminPages.module.scss";

type Slide = {
  id: string;
  imageUrl: string;
  title: string;
  details: string;
  time: string;
  order: number;
};

export default function CarouselsPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/carousels")
      .then((res) => res.json())
      .then((data) => {
        setSlides(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    setDeleting(id);
    await fetch(`/api/carousels/${id}`, { method: "DELETE" });
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOver.current = index;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) return;

    const reordered = [...slides];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOver.current, 0, removed);

    const updated = reordered.map((s, i) => ({ ...s, order: i }));
    setSlides(updated);
    dragItem.current = null;
    dragOver.current = null;

    setSaving(true);
    await fetch("/api/carousels/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: updated.map((s) => ({ id: s.id, order: s.order })),
      }),
    });
    setSaving(false);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Carousel slides</h1>
          {saving && (
            <span className={styles.savingIndicator}>Saving order...</span>
          )}
        </div>
        <button
          className={styles.addButton}
          onClick={() => router.push("/admin/carousels/new")}
        >
          Add slide
        </button>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading...</div>
      ) : slides.length === 0 ? (
        <div className={styles.emptyState}>
          No slides yet. Add one to get started.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: 40 }}></th>
              <th className={styles.th}>Image</th>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Time</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide, index) => (
              <tr
                key={slide.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={styles.draggableRow}
              >
                <td className={styles.td}>
                  <span className={styles.dragHandle}>⠿</span>
                </td>
                <td className={styles.td}>
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    width={60}
                    height={40}
                    className={styles.thumbnail}
                  />
                </td>
                <td className={styles.td}>{slide.title}</td>
                <td className={styles.td}>{slide.time}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() =>
                        router.push(`/admin/carousels/${slide.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(slide.id)}
                      disabled={deleting === slide.id}
                    >
                      {deleting === slide.id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
