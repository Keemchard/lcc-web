"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function NewPropertyItemPage() {
  const router = useRouter();
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, category, quantity, condition, location,
          dateAcquired, acquisitionType, value, notes,
          maintenanceHistory: [],
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

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Add item</h1>
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
            <input className={styles.formInput} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Plastic chairs" />
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
            <textarea className={styles.formTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={adminStyles.submitButton} disabled={saving}>
              {saving ? "Saving..." : "Save item"}
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
