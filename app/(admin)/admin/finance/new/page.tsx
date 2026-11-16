"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type {
  FinanceReport,
  ReportType,
  IncomeEntry,
  DisbursementCategory,
  AdditionalIncome,
} from "@/types/finance";
import {
  MONTHS,
  DEFAULT_RECEIPTS_CATEGORIES,
  DEFAULT_BUILDING_CATEGORIES,
  DEFAULT_RECEIPTS_ADDITIONAL,
  computeTotals,
} from "@/types/finance";
import adminStyles from "../../AdminPages.module.scss";
import styles from "../Finance.module.scss";

const now = new Date();

function CurrencyInput({
  value,
  onChange,
  placeholder = "0.00",
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
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
        placeholder={placeholder}
      />
    </div>
  );
}

function defaultSignatories(type: ReportType) {
  if (type === "receipts") {
    return {
      preparedBy: { name: "Elenita Tamio", title: "Treasurer, LCC" },
      attestedBy: { name: "Marites Luis", title: "Auditor, LCC" },
    };
  }
  return {
    preparedBy: { name: "Rhea Bago", title: "Property Custodian Head, LCC" },
    attestedBy: { name: "Marites Luis", title: "Auditor, LCC" },
  };
}

export default function NewFinanceReportPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState<ReportType>("receipts");
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [balanceForwarded, setBalanceForwarded] = useState(0);
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([
    { date: "", amount: 0 },
  ]);
  const [additionalIncome, setAdditionalIncome] = useState<AdditionalIncome[]>(
    [...DEFAULT_RECEIPTS_ADDITIONAL]
  );
  const [disbursements, setDisbursements] = useState<DisbursementCategory[]>(
    DEFAULT_RECEIPTS_CATEGORIES.map((c) => ({
      category: c.category,
      items: c.items.map((i) => ({ ...i })),
    }))
  );
  const [preparedBy, setPreparedBy] = useState(
    defaultSignatories("receipts").preparedBy
  );
  const [attestedBy, setAttestedBy] = useState(
    defaultSignatories("receipts").attestedBy
  );

  const fetchPreviousBalance = useCallback(async (t: ReportType, m: number, y: number) => {
    const prevMonth = m === 0 ? 11 : m - 1;
    const prevYear = m === 0 ? y - 1 : y;
    try {
      const res = await fetch(`/api/finance?type=${t}`);
      if (!res.ok) return;
      const reports = await res.json();
      const prev = reports.find(
        (r: FinanceReport) => r.month === prevMonth && r.year === prevYear
      );
      if (prev) {
        const prevTotals = computeTotals(prev);
        setBalanceForwarded(prevTotals.balanceToForward);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchPreviousBalance(type, month, year);
  }, [type, month, year, fetchPreviousBalance]);

  const report: FinanceReport = {
    type,
    month,
    year,
    balanceForwarded,
    incomeEntries,
    additionalIncome: type === "receipts" ? additionalIncome : [],
    disbursements,
    preparedBy,
    attestedBy,
  };
  const totals = computeTotals(report);

  const handleTypeChange = (newType: ReportType) => {
    setType(newType);
    const sigs = defaultSignatories(newType);
    setPreparedBy(sigs.preparedBy);
    setAttestedBy(sigs.attestedBy);
    if (newType === "receipts") {
      setDisbursements(
        DEFAULT_RECEIPTS_CATEGORIES.map((c) => ({
          category: c.category,
          items: c.items.map((i) => ({ ...i })),
        }))
      );
      setAdditionalIncome([...DEFAULT_RECEIPTS_ADDITIONAL]);
    } else {
      setDisbursements(
        DEFAULT_BUILDING_CATEGORIES.map((c) => ({
          category: c.category,
          items: c.items.map((i) => ({ ...i })),
        }))
      );
      setAdditionalIncome([]);
    }
  };

  const updateIncome = (index: number, field: keyof IncomeEntry, value: string | number) => {
    setIncomeEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    );
  };

  const updateAdditional = (index: number, field: keyof AdditionalIncome, value: string | number) => {
    setAdditionalIncome((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    );
  };

  const updateDisbursementItem = (
    catIdx: number,
    itemIdx: number,
    field: "label" | "amount",
    value: string | number
  ) => {
    setDisbursements((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? {
              ...cat,
              items: cat.items.map((item, ii) =>
                ii === itemIdx ? { ...item, [field]: value } : item
              ),
            }
          : cat
      )
    );
  };

  const addIncomeEntry = () =>
    setIncomeEntries((prev) => [...prev, { date: "", amount: 0 }]);

  const removeIncomeEntry = (index: number) =>
    setIncomeEntries((prev) => prev.filter((_, i) => i !== index));

  const addAdditionalItem = () =>
    setAdditionalIncome((prev) => [...prev, { label: "", amount: 0 }]);

  const removeAdditionalItem = (index: number) =>
    setAdditionalIncome((prev) => prev.filter((_, i) => i !== index));

  const addDisbursementItem = (catIdx: number) =>
    setDisbursements((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? { ...cat, items: [...cat.items, { label: "", amount: 0 }] }
          : cat
      )
    );

  const removeDisbursementItem = (catIdx: number, itemIdx: number) =>
    setDisbursements((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? { ...cat, items: cat.items.filter((_, ii) => ii !== itemIdx) }
          : cat
      )
    );

  const addCategory = () => {
    const name = prompt("Category name:");
    if (!name) return;
    setDisbursements((prev) => [
      ...prev,
      { category: name, items: [{ label: "", amount: 0 }] },
    ]);
  };

  const removeCategory = (catIdx: number) => {
    if (!confirm("Remove this entire category?")) return;
    setDisbursements((prev) => prev.filter((_, i) => i !== catIdx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      router.push("/admin/finance");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  };

  const formatPHP = (n: number) =>
    `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const mon = MONTHS[d.getMonth()].slice(0, 3);
    return `${day}-${mon}`;
  };

  const dateToInputValue = (dateLabel: string) => {
    if (!dateLabel) return "";
    const parts = dateLabel.match(/^(\d+)-(\w+)$/);
    if (!parts) return "";
    const monIdx = MONTHS.findIndex((m) =>
      m.toLowerCase().startsWith(parts[2].toLowerCase())
    );
    if (monIdx === -1) return "";
    const y = year;
    const m = String(monIdx + 1).padStart(2, "0");
    const d = String(parts[1]).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };


  return (
    <div>
      <h1 className={adminStyles.pageTitle}>New finance report</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.reportForm}>
        {/* Header */}
        <div className={styles.formSection}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Report type</label>
              <select
                className={styles.formSelect}
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as ReportType)}
              >
                <option value="receipts">
                  Statement of Receipts & Disbursements
                </option>
                <option value="building">Offering - Church Building</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Month</label>
              <select
                className={styles.formSelect}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
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
            <label className={styles.formLabel}>
              Balance forwarded for the month
            </label>
            <CurrencyInput
              value={balanceForwarded}
              onChange={setBalanceForwarded}
            />
          </div>
        </div>

        {/* Income */}
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>
            <span>{type === "receipts" ? "Tithes" : "Offerings"}</span>
          </div>
          <table className={styles.incomeTable}>
            <tbody>
              {incomeEntries.map((entry, i) => (
                <tr key={i}>
                  <td>
                    <input
                      className={styles.dateInput}
                      type="date"
                      value={dateToInputValue(entry.date)}
                      onChange={(e) =>
                        updateIncome(i, "date", formatDateLabel(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      value={entry.amount}
                      onChange={(v) => updateIncome(i, "amount", v)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeIncomeEntry(i)}
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
            onClick={addIncomeEntry}
          >
            + Add entry
          </button>
          <div className={styles.totalRow}>
            <span>
              Total {type === "receipts" ? "Tithes" : "Offerings"}
            </span>
            <span>{formatPHP(totals.totalIncome)}</span>
          </div>
        </div>

        {/* Additional Income (receipts only) */}
        {type === "receipts" && (
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <span>Additional income</span>
            </div>
            <table className={styles.incomeTable}>
              <tbody>
                {additionalIncome.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        className={styles.labelInput}
                        value={item.label}
                        onChange={(e) =>
                          updateAdditional(i, "label", e.target.value)
                        }
                        placeholder="Item label"
                      />
                    </td>
                    <td>
                      <CurrencyInput
                        value={item.amount}
                        onChange={(v) => updateAdditional(i, "amount", v)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeAdditionalItem(i)}
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
              onClick={addAdditionalItem}
            >
              + Add item
            </button>
          </div>
        )}

        {/* Total Cash Available */}
        <div className={styles.formSection}>
          <div className={styles.grandTotal}>
            <span>Total cash available</span>
            <span>{formatPHP(totals.totalCashAvailable)}</span>
          </div>
        </div>

        {/* Disbursements */}
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>
            <span>Less: Cash disbursement</span>
          </div>

          {disbursements.map((cat, catIdx) => (
            <div key={catIdx}>
              <div className={styles.categoryHeader}>
                <span>{cat.category}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={styles.categoryTotal}>
                    {formatPHP(
                      totals.categoryTotals[catIdx]?.total ?? 0
                    )}
                  </span>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeCategory(catIdx)}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <table className={styles.disbursementTable}>
                <tbody>
                  {cat.items.map((item, itemIdx) => (
                    <tr key={itemIdx}>
                      <td>
                        <input
                          className={styles.labelInput}
                          value={item.label}
                          onChange={(e) =>
                            updateDisbursementItem(
                              catIdx,
                              itemIdx,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="Item description"
                        />
                      </td>
                      <td>
                        <CurrencyInput
                          value={item.amount}
                          onChange={(v) =>
                            updateDisbursementItem(catIdx, itemIdx, "amount", v)
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() =>
                            removeDisbursementItem(catIdx, itemIdx)
                          }
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
                onClick={() => addDisbursementItem(catIdx)}
              >
                + Add item
              </button>
            </div>
          ))}

          <button
            type="button"
            className={styles.addButton}
            style={{ marginTop: 16 }}
            onClick={addCategory}
          >
            + Add category
          </button>

          <div className={styles.totalRow}>
            <span>Total expenses</span>
            <span>{formatPHP(totals.totalExpenses)}</span>
          </div>

          <div className={styles.grandTotal}>
            <span>
              Balance to be forwarded for {MONTHS[month]} {year}
            </span>
            <span>{formatPHP(totals.balanceToForward)}</span>
          </div>
        </div>

        {/* Signatories */}
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>
            <span>Signatories</span>
          </div>
          <div className={styles.signatorySection}>
            <div className={styles.signatoryGroup}>
              <h4>Prepared by</h4>
              <input
                className={styles.formInput}
                value={preparedBy.name}
                onChange={(e) =>
                  setPreparedBy((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Name"
              />
              <input
                className={styles.formInput}
                value={preparedBy.title}
                onChange={(e) =>
                  setPreparedBy((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Title"
              />
            </div>
            <div className={styles.signatoryGroup}>
              <h4>Attested by</h4>
              <input
                className={styles.formInput}
                value={attestedBy.name}
                onChange={(e) =>
                  setAttestedBy((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Name"
              />
              <input
                className={styles.formInput}
                value={attestedBy.title}
                onChange={(e) =>
                  setAttestedBy((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Title"
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={adminStyles.submitButton}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save report"}
          </button>
          <button
            type="button"
            className={adminStyles.cancelButton}
            onClick={() => router.push("/admin/finance")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
