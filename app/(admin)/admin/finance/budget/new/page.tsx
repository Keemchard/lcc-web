"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AnnualBudget, BudgetSection } from "@/types/budget";
import { DEFAULT_BUDGET_SECTIONS, computeBudgetTotals } from "@/types/budget";
import adminStyles from "../../../AdminPages.module.scss";
import styles from "../../Finance.module.scss";

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

export default function NewBudgetPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [year, setYear] = useState(new Date().getFullYear() + 1);
  const [notes, setNotes] = useState("");
  const [sections, setSections] = useState<BudgetSection[]>(
    DEFAULT_BUDGET_SECTIONS.map((s) => ({
      section: s.section,
      items: s.items.map((i) => ({ ...i })),
    }))
  );

  const budget: AnnualBudget = { year, sections, notes };
  const { sectionTotals, grandTotal } = computeBudgetTotals(budget);

  const formatPHP = (n: number) =>
    `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const updateItem = (
    secIdx: number,
    itemIdx: number,
    field: "label" | "amount" | "remarks",
    value: string | number
  ) => {
    setSections((prev) =>
      prev.map((sec, si) =>
        si === secIdx
          ? {
              ...sec,
              items: sec.items.map((item, ii) =>
                ii === itemIdx ? { ...item, [field]: value } : item
              ),
            }
          : sec
      )
    );
  };

  const addItem = (secIdx: number) =>
    setSections((prev) =>
      prev.map((sec, si) =>
        si === secIdx
          ? { ...sec, items: [...sec.items, { label: "", amount: 0, remarks: "" }] }
          : sec
      )
    );

  const removeItem = (secIdx: number, itemIdx: number) =>
    setSections((prev) =>
      prev.map((sec, si) =>
        si === secIdx
          ? { ...sec, items: sec.items.filter((_, ii) => ii !== itemIdx) }
          : sec
      )
    );

  const addSection = () => {
    const name = prompt("Section name:");
    if (!name) return;
    setSections((prev) => [
      ...prev,
      { section: name, items: [{ label: "", amount: 0, remarks: "" }] },
    ]);
  };

  const removeSection = (secIdx: number) => {
    if (!confirm("Remove this entire section?")) return;
    setSections((prev) => prev.filter((_, i) => i !== secIdx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/finance/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      router.push("/admin/finance/budget");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>New annual budget</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.reportForm}>
        <div className={styles.formSection}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Year</label>
              <input
                className={styles.formInput}
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2020}
              />
            </div>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Notes</label>
            <textarea
              className={styles.formInput}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Budget notes or remarks"
              rows={2}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Sections */}
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>
            <span>Budget allocation by section</span>
          </div>

          {sections.map((sec, secIdx) => (
            <div key={secIdx}>
              <div className={styles.categoryHeader}>
                <span>{sec.section}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={styles.categoryTotal}>
                    {formatPHP(sectionTotals[secIdx]?.total ?? 0)}
                  </span>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeSection(secIdx)}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <table className={styles.incomeTable}>
                <tbody>
                  {sec.items.map((item, itemIdx) => (
                    <tr key={itemIdx}>
                      <td>
                        <input
                          className={styles.labelInput}
                          value={item.label}
                          onChange={(e) =>
                            updateItem(secIdx, itemIdx, "label", e.target.value)
                          }
                          placeholder="Line item"
                        />
                      </td>
                      <td>
                        <CurrencyInput
                          value={item.amount}
                          onChange={(v) =>
                            updateItem(secIdx, itemIdx, "amount", v)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className={styles.labelInput}
                          value={item.remarks || ""}
                          onChange={(e) =>
                            updateItem(secIdx, itemIdx, "remarks", e.target.value)
                          }
                          placeholder="Remarks"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeItem(secIdx, itemIdx)}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => addItem(secIdx)}
              >
                + Add item
              </button>
            </div>
          ))}

          <button
            type="button"
            className={styles.addButton}
            style={{ marginTop: 16 }}
            onClick={addSection}
          >
            + Add section
          </button>

          <div className={styles.grandTotal}>
            <span>Total annual budget</span>
            <span>{formatPHP(grandTotal)}</span>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={adminStyles.submitButton}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save budget"}
          </button>
          <button
            type="button"
            className={adminStyles.cancelButton}
            onClick={() => router.push("/admin/finance/budget")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
