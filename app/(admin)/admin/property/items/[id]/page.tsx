"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { AssetItem, MaintenanceEntry } from "@/types/property";
import { ASSET_CATEGORIES, ASSET_CONDITIONS, ASSET_LOCATIONS } from "@/types/property";
import adminStyles from "../../../AdminPages.module.scss";
import styles from "../../Property.module.scss";

function CurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className={styles.currencyWrapper}>
      <span className={styles.currencyPrefix}>₱</span>
      <input
        className={styles.amountInput}
        type="number"
        step="0.01"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="0.00"
      />
    </div>
  );
}

export default function EditPropertyItemPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState(ASSET_CATEGORIES[0]);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState(ASSET_CONDITIONS[0]);
  const [location, setLocation] = useState(ASSET_LOCATIONS[0]);
  const [dateAcquired, setDateAcquired] = useState("");
  const [acquisitionType, setAcquisitionType] = useState<"Purchased" | "Donated">("Purchased");
  const [value, setValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceEntry[]>([]);

  const [showMaintForm, setShowMaintForm] = useState(false);
  const [maintDate, setMaintDate] = useState("");
  const [maintDesc, setMaintDesc] = useState("");
  const [maintCost, setMaintCost] = useState(0);
  const [maintBy, setMaintBy] = useState("");

  useEffect(() => {
    fetch(`/api/property/${id}`)
      .then((r) => r.json())
      .then((data: AssetItem) => {
        setName(data.name || "");
        setCategory(data.category || ASSET_CATEGORIES[0]);
        setQuantity(data.quantity || 1);
        setCondition(data.condition || ASSET_CONDITIONS[0]);
        setLocation(data.location || ASSET_LOCATIONS[0]);
        setDateAcquired(data.dateAcquired || "");
        setAcquisitionType(data.acquisitionType || "Purchased");
        setValue(data.value || 0);
        setNotes(data.notes || "");
        setMaintenanceHistory(data.maintenanceHistory || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const addMaintEntry = () => {
    if (!maintDesc.trim()) return;
    setMaintenanceHistory((prev) => [
      ...prev,
      { date: maintDate, description: maintDesc, cost: maintCost, performedBy: maintBy },
    ]);
    setMaintDate("");
    setMaintDesc("");
    setMaintCost(0);
    setMaintBy("");
    setShowMaintForm(false);
  };

  const removeMaintEntry = (idx: number) => {
    setMaintenanceHistory((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/property/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, category, quantity, condition, location,
          dateAcquired, acquisitionType, value, notes, maintenanceHistory,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      router.push("/admin/property/items");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={adminStyles.emptyState}>Loading...</div>;
  }

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Edit item</h1>
      </div>

      <div className={styles.propertyTabs}>
        <Link href="/admin/property" className={styles.propertyTab}>Dashboard</Link>
        <Link href="/admin/property/items" className={`${styles.propertyTab} ${styles.propertyTabActive}`}>Items</Link>
        <Link href="/admin/property/borrow" className={styles.propertyTab}>Borrow log</Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Name</label>
            <input className={styles.formInput} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Category</label>
              <select className={styles.formSelect} value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
                {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Quantity</label>
              <input className={styles.formInput} type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Condition</label>
              <select className={styles.formSelect} value={condition} onChange={(e) => setCondition(e.target.value as typeof condition)}>
                {ASSET_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Location</label>
              <select className={styles.formSelect} value={location} onChange={(e) => setLocation(e.target.value)}>
                {ASSET_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Date acquired</label>
              <input className={styles.formInput} type="date" value={dateAcquired} onChange={(e) => setDateAcquired(e.target.value)} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Acquisition type</label>
              <select className={styles.formSelect} value={acquisitionType} onChange={(e) => setAcquisitionType(e.target.value as typeof acquisitionType)}>
                <option value="Purchased">Purchased</option>
                <option value="Donated">Donated</option>
              </select>
            </div>
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Value</label>
            <CurrencyInput value={value} onChange={setValue} />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Notes</label>
            <textarea className={styles.formTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {/* Maintenance History */}
          <div className={styles.maintenanceSection}>
            <h3 className={styles.chartTitle}>Maintenance history</h3>

            {maintenanceHistory.length > 0 && (
              <table className={adminStyles.table}>
                <thead>
                  <tr>
                    <th className={adminStyles.th}>Date</th>
                    <th className={adminStyles.th}>Description</th>
                    <th className={adminStyles.th} style={{ textAlign: "right" }}>Cost</th>
                    <th className={adminStyles.th}>By</th>
                    <th className={adminStyles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceHistory.map((entry, idx) => (
                    <tr key={idx}>
                      <td className={adminStyles.td}>{entry.date}</td>
                      <td className={adminStyles.td}>{entry.description}</td>
                      <td className={`${adminStyles.td} ${styles.amountCell}`}>
                        ₱{(entry.cost || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </td>
                      <td className={adminStyles.td}>{entry.performedBy}</td>
                      <td className={adminStyles.td}>
                        <button
                          type="button"
                          className={adminStyles.deleteButton}
                          onClick={() => removeMaintEntry(idx)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showMaintForm ? (
              <div className={styles.inlineForm}>
                <div className={styles.inlineFormField}>
                  <label>Date</label>
                  <input type="date" value={maintDate} onChange={(e) => setMaintDate(e.target.value)} />
                </div>
                <div className={styles.inlineFormField}>
                  <label>Description</label>
                  <input value={maintDesc} onChange={(e) => setMaintDesc(e.target.value)} placeholder="What was done" />
                </div>
                <div className={styles.inlineFormField}>
                  <label>Cost</label>
                  <input type="number" step="0.01" value={maintCost || ""} onChange={(e) => setMaintCost(Number(e.target.value))} placeholder="0" />
                </div>
                <div className={styles.inlineFormField}>
                  <label>Performed by</label>
                  <input value={maintBy} onChange={(e) => setMaintBy(e.target.value)} placeholder="Name" />
                </div>
                <button type="button" className={adminStyles.editButton} onClick={addMaintEntry}>Add</button>
                <button type="button" className={adminStyles.cancelButton} onClick={() => setShowMaintForm(false)} style={{ padding: "4px 12px" }}>Cancel</button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMaintForm(true)}
                style={{
                  marginTop: 8,
                  padding: "4px 12px",
                  border: "1px dashed #c5ccd6",
                  background: "transparent",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#2d5f94",
                  cursor: "pointer",
                }}
              >
                + Add maintenance entry
              </button>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={adminStyles.submitButton} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button type="button" className={adminStyles.cancelButton} onClick={() => router.push("/admin/property/items")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
