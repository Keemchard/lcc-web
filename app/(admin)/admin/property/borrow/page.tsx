"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AssetItem, BorrowRecord } from "@/types/property";
import adminStyles from "../../AdminPages.module.scss";
import styles from "../Property.module.scss";

type AssetWithId = AssetItem & { id: string };
type BorrowWithId = BorrowRecord & { id: string };

export default function BorrowLogPage() {
  const [borrows, setBorrows] = useState<BorrowWithId[]>([]);
  const [assets, setAssets] = useState<AssetWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Borrowed" | "Returned">("all");
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // New borrow form
  const [assetId, setAssetId] = useState("");
  const [borrower, setBorrower] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dateOut, setDateOut] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/property/borrow").then((r) => r.json()),
      fetch("/api/property").then((r) => r.json()),
    ])
      .then(([b, a]) => {
        setBorrows(Array.isArray(b) ? b : []);
        setAssets(Array.isArray(a) ? a : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!assetId || !borrower.trim()) return;
    setFormSaving(true);
    const asset = assets.find((a) => a.id === assetId);
    try {
      const res = await fetch("/api/property/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          assetName: asset?.name || "Unknown",
          borrower,
          purpose,
          dateOut,
          dateReturned: "",
          status: "Borrowed",
        }),
      });
      if (res.ok) {
        const { id } = await res.json();
        setBorrows((prev) => [
          {
            id,
            assetId,
            assetName: asset?.name || "Unknown",
            borrower,
            purpose,
            dateOut,
            dateReturned: "",
            status: "Borrowed",
          },
          ...prev,
        ]);
        setShowModal(false);
        setAssetId("");
        setBorrower("");
        setPurpose("");
        setDateOut("");
      }
    } catch {}
    setFormSaving(false);
  };

  const handleReturn = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    await fetch(`/api/property/borrow/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateReturned: today, status: "Returned" }),
    });
    setBorrows((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, dateReturned: today, status: "Returned" } : b
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this borrow record?")) return;
    setDeleting(id);
    await fetch(`/api/property/borrow/${id}`, { method: "DELETE" });
    setBorrows((prev) => prev.filter((b) => b.id !== id));
    setDeleting(null);
  };

  const filtered =
    filter === "all" ? borrows : borrows.filter((b) => b.status === filter);

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Property</h1>
        <button className={adminStyles.addButton} onClick={() => setShowModal(true)}>
          New borrow record
        </button>
      </div>

      <div className={styles.propertyTabs}>
        <Link href="/admin/property" className={styles.propertyTab}>Dashboard</Link>
        <Link href="/admin/property/items" className={styles.propertyTab}>Items</Link>
        <Link href="/admin/property/borrow" className={`${styles.propertyTab} ${styles.propertyTabActive}`}>Borrow log</Link>
        <Link href="/admin/property/export" className={styles.propertyTab}>Export</Link>
      </div>

      <div className={styles.searchRow}>
        {(["all", "Borrowed", "Returned"] as const).map((f) => (
          <button
            key={f}
            className={`${styles.propertyTab} ${filter === f ? styles.propertyTabActive : ""}`}
            onClick={() => setFilter(f)}
            style={{ padding: "6px 12px", borderBottom: "none", marginBottom: 0 }}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={adminStyles.emptyState}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={adminStyles.emptyState}>No borrow records yet.</div>
      ) : (
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th className={adminStyles.th}>Item</th>
              <th className={adminStyles.th}>Borrower</th>
              <th className={adminStyles.th}>Purpose</th>
              <th className={adminStyles.th}>Date out</th>
              <th className={adminStyles.th}>Date returned</th>
              <th className={adminStyles.th}>Status</th>
              <th className={adminStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td className={adminStyles.td}>{b.assetName}</td>
                <td className={adminStyles.td}>{b.borrower}</td>
                <td className={adminStyles.td}>{b.purpose}</td>
                <td className={adminStyles.td}>{b.dateOut}</td>
                <td className={adminStyles.td}>{b.dateReturned || "—"}</td>
                <td className={adminStyles.td}>
                  <span
                    className={styles.conditionBadge}
                    style={{
                      backgroundColor:
                        b.status === "Borrowed" ? "#f59e0b" : "#16a34a",
                    }}
                  >
                    {b.status}
                  </span>
                </td>
                <td className={adminStyles.td}>
                  <div className={adminStyles.actions}>
                    {b.status === "Borrowed" && (
                      <button
                        className={adminStyles.editButton}
                        onClick={() => handleReturn(b.id)}
                      >
                        Return
                      </button>
                    )}
                    <button
                      className={adminStyles.deleteButton}
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting === b.id}
                    >
                      {deleting === b.id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* New borrow modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>New borrow record</h3>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Asset</label>
              <select className={styles.formSelect} value={assetId} onChange={(e) => setAssetId(e.target.value)}>
                <option value="">Select an item</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.category})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Borrower</label>
              <input className={styles.formInput} value={borrower} onChange={(e) => setBorrower(e.target.value)} placeholder="Name of borrower" />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Purpose</label>
              <input className={styles.formInput} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Reason for borrowing" />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Date out</label>
              <input className={styles.formInput} type="date" value={dateOut} onChange={(e) => setDateOut(e.target.value)} />
            </div>

            <div className={styles.formActions}>
              <button className={adminStyles.submitButton} onClick={handleCreate} disabled={formSaving || !assetId || !borrower.trim()}>
                {formSaving ? "Saving..." : "Save"}
              </button>
              <button className={adminStyles.cancelButton} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
