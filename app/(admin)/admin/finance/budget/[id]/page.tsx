"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import type { AnnualBudget, BudgetSection } from "@/types/budget";
import { computeBudgetTotals } from "@/types/budget";
import type { FinanceReport } from "@/types/finance";
import { computeTotals } from "@/types/finance";
import { auth } from "@/lib/firebase/client";
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

const SECTION_TO_CATEGORY: Record<string, string> = {
  "Fellowship Coordinator": "Ministry - Fellowship",
  "Training Director": "Ministry - Training",
  "Sunday School Director": "Ministry - Christian Education",
  "Program Coordinator": "Ministry - Membership",
  "Membership Coordinator": "Ministry - Membership",
  "Property Custodian": "Ministry - Trustees",
  "Finance / Administration": "Finance / Administration",
  "Mission and Evangelism": "Ministry - Mission and Evangelism",
  "Church Building": "Church Building - Cash Disbursement",
};

function formatPHP(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function EditBudgetPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"edit" | "comparison">("edit");
  const [chartMode, setChartMode] = useState<"bar" | "pie">("bar");

  const [year, setYear] = useState(2027);
  const [notes, setNotes] = useState("");
  const [sections, setSections] = useState<BudgetSection[]>([]);

  // Actual finance data
  const [actualData, setActualData] = useState<
    Map<string, number>
  >(new Map());
  const [actualTotal, setActualTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      // Refresh session token first
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });
      }

      const budgetRes = await fetch(`/api/finance/budget/${id}`);
      const data: AnnualBudget = await budgetRes.json();
      setYear(data.year);
      setNotes(data.notes || "");
      setSections(data.sections || []);
      setLoading(false);

      // Fetch actual finance reports for comparison (both receipts AND building)
      const financeRes = await fetch("/api/finance");
      const allReports: FinanceReport[] = await financeRes.json();
      const reports = Array.isArray(allReports) ? allReports : [];
      const yearReports = reports.filter(
        (r) => Number(r.year) === Number(data.year)
      );
      const catMap = new Map<string, number>();
      let total = 0;
      yearReports.forEach((r) => {
        if (r.disbursements) {
          r.disbursements.forEach((cat) => {
            const catTotal = cat.items.reduce((s, item) => s + (item.amount || 0), 0);
            if (catTotal > 0) {
              const label = r.type === "building"
                ? `Church Building - ${cat.category}`
                : cat.category;
              catMap.set(label, (catMap.get(label) ?? 0) + catTotal);
              total += catTotal;
            }
          });
        }
      });
      setActualData(catMap);
      setActualTotal(total);
    }
    loadData().catch(() => setLoading(false));
  }, [id]);

  const budget: AnnualBudget = { year, sections, notes };
  const { sectionTotals, grandTotal } = computeBudgetTotals(budget);

  // Comparison data — match budget sections to actual finance categories
  const matchedActualKeys = new Set<string>();

  const findActual = (sectionName: string): number => {
    // Try exact mapping first
    const mapped = SECTION_TO_CATEGORY[sectionName];
    if (mapped && actualData.has(mapped)) {
      matchedActualKeys.add(mapped);
      return actualData.get(mapped)!;
    }
    // Try direct match
    if (actualData.has(sectionName)) {
      matchedActualKeys.add(sectionName);
      return actualData.get(sectionName)!;
    }
    // Try partial match
    for (const [cat, amount] of actualData) {
      if (cat.toLowerCase().includes(sectionName.toLowerCase()) ||
          sectionName.toLowerCase().includes(cat.toLowerCase())) {
        matchedActualKeys.add(cat);
        return amount;
      }
    }
    return 0;
  };

  const comparisonRows = sections.map((sec, i) => {
    const budgeted = sectionTotals[i]?.total ?? 0;
    const actual = findActual(sec.section);
    const variance = budgeted - actual;
    const variancePct = budgeted > 0 ? (variance / budgeted) * 100 : 0;
    return {
      section: sec.section,
      budgeted,
      actual,
      variance,
      variancePct,
    };
  });

  // Find unmatched actual spending — categories in finance reports not in any budget section
  const unmatchedRows: typeof comparisonRows = [];
  for (const [cat, amount] of actualData) {
    if (!matchedActualKeys.has(cat) && amount > 0) {
      unmatchedRows.push({
        section: cat,
        budgeted: 0,
        actual: amount,
        variance: -amount,
        variancePct: 0,
      });
    }
  }

  const allComparisonRows = [...comparisonRows, ...unmatchedRows];
  const totalBudgetedComp = allComparisonRows.reduce((s, r) => s + r.budgeted, 0);
  const totalActualComp = allComparisonRows.reduce((s, r) => s + r.actual, 0);

  const maxCompBar = Math.max(
    ...allComparisonRows.map((r) => Math.max(r.budgeted, r.actual)),
    1
  );

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
      const res = await fetch(`/api/finance/budget/${id}`, {
        method: "PUT",
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

  if (loading) {
    return <div className={adminStyles.emptyState}>Loading...</div>;
  }

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Budget {year}</h1>
        <button
          className={adminStyles.cancelButton}
          onClick={() => router.push("/admin/finance/budget")}
        >
          Back
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${tab === "edit" ? styles.filterTabActive : ""}`}
          onClick={() => setTab("edit")}
        >
          Edit budget
        </button>
        <button
          className={`${styles.filterTab} ${tab === "comparison" ? styles.filterTabActive : ""}`}
          onClick={() => setTab("comparison")}
        >
          Budget vs Actual
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {tab === "edit" ? (
        /* ── Edit tab ──────────────────────────────── */
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
                placeholder="Budget notes"
                rows={2}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <span>Budget allocation by section</span>
            </div>

            {sections.map((sec, secIdx) => (
              <div key={secIdx}>
                <div className={styles.categoryHeader}>
                  <span>{sec.section}</span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
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
                              updateItem(
                                secIdx,
                                itemIdx,
                                "label",
                                e.target.value
                              )
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
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        /* ── Comparison tab ──────────────────────────── */
        <div>
          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total budgeted</p>
              <p className={styles.summaryValue}>{formatPHP(grandTotal)}</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total actual spending</p>
              <p className={styles.summaryValue}>{formatPHP(actualTotal)}</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Variance</p>
              <p
                className={styles.summaryValue}
                style={{
                  color:
                    grandTotal - actualTotal >= 0 ? "#16a34a" : "#dc2626",
                }}
              >
                {formatPHP(Math.abs(grandTotal - actualTotal))}
                {grandTotal - actualTotal >= 0 ? " under" : " over"}
              </p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Utilization</p>
              <p className={styles.summaryValue}>
                {grandTotal > 0
                  ? `${((actualTotal / grandTotal) * 100).toFixed(1)}%`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Comparison table */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Budget vs actual by section — {year}
            </h3>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th className={adminStyles.th}>Section</th>
                  <th
                    className={adminStyles.th}
                    style={{ textAlign: "right" }}
                  >
                    Budgeted
                  </th>
                  <th
                    className={adminStyles.th}
                    style={{ textAlign: "right" }}
                  >
                    Actual
                  </th>
                  <th
                    className={adminStyles.th}
                    style={{ textAlign: "right" }}
                  >
                    Variance
                  </th>
                  <th
                    className={adminStyles.th}
                    style={{ textAlign: "right" }}
                  >
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {allComparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    style={
                      row.budgeted === 0 && row.actual > 0
                        ? { backgroundColor: "rgba(220, 38, 38, 0.04)" }
                        : undefined
                    }
                  >
                    <td className={adminStyles.td}>
                      {row.section}
                      {row.budgeted === 0 && row.actual > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "#dc2626",
                            marginLeft: 8,
                            fontWeight: 500,
                          }}
                        >
                          Unbudgeted
                        </span>
                      )}
                    </td>
                    <td
                      className={adminStyles.td}
                      style={{
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatPHP(row.budgeted)}
                    </td>
                    <td
                      className={adminStyles.td}
                      style={{
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatPHP(row.actual)}
                    </td>
                    <td
                      className={adminStyles.td}
                      style={{
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        color: row.variance >= 0 ? "#16a34a" : "#dc2626",
                        fontWeight: 600,
                      }}
                    >
                      {row.variance >= 0 ? "+" : ""}
                      {formatPHP(row.variance)}
                    </td>
                    <td
                      className={adminStyles.td}
                      style={{
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        color: row.variance >= 0 ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {row.budgeted > 0
                        ? `${row.variancePct >= 0 ? "+" : ""}${row.variancePct.toFixed(1)}%`
                        : "—"}
                    </td>
                  </tr>
                ))}
                <tr
                  style={{
                    borderTop: "2px solid #0b1f33",
                    fontWeight: 700,
                  }}
                >
                  <td className={adminStyles.td}>Total</td>
                  <td
                    className={adminStyles.td}
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatPHP(grandTotal)}
                  </td>
                  <td
                    className={adminStyles.td}
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatPHP(actualTotal)}
                  </td>
                  <td
                    className={adminStyles.td}
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                      color:
                        grandTotal - actualTotal >= 0
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: 700,
                    }}
                  >
                    {grandTotal - actualTotal >= 0 ? "+" : ""}
                    {formatPHP(grandTotal - actualTotal)}
                  </td>
                  <td
                    className={adminStyles.td}
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {grandTotal > 0
                      ? `${(((grandTotal - actualTotal) / grandTotal) * 100).toFixed(1)}%`
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Chart */}
          <div className={styles.chartCard} style={{ marginTop: 24 }}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Visual comparison</h3>
              <div className={styles.chartToggle}>
                <button
                  className={`${styles.toggleBtn} ${chartMode === "bar" ? styles.toggleBtnActive : ""}`}
                  onClick={() => setChartMode("bar")}
                  title="Bar chart"
                >
                  |||
                </button>
                <button
                  className={`${styles.toggleBtn} ${chartMode === "pie" ? styles.toggleBtnActive : ""}`}
                  onClick={() => setChartMode("pie")}
                  title="Pie chart"
                >
                  ◔
                </button>
              </div>
            </div>

            {chartMode === "bar" ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {allComparisonRows
                    .filter((r) => r.budgeted > 0 || r.actual > 0)
                    .map((row, i) => (
                      <div key={i}>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#556070",
                            marginBottom: 4,
                          }}
                        >
                          {row.section}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 3,
                            }}
                          >
                            <div
                              style={{
                                height: 14,
                                width: `${(row.budgeted / maxCompBar) * 100}%`,
                                backgroundColor: "#2d5f94",
                                borderRadius: 3,
                                minWidth: row.budgeted > 0 ? 4 : 0,
                              }}
                            />
                            <div
                              style={{
                                height: 14,
                                width: `${(row.actual / maxCompBar) * 100}%`,
                                backgroundColor:
                                  row.actual > row.budgeted
                                    ? "#dc2626"
                                    : "#16a34a",
                                borderRadius: 3,
                                minWidth: row.actual > 0 ? 4 : 0,
                              }}
                            />
                          </div>
                          <div
                            style={{
                              width: 80,
                              textAlign: "right",
                              fontSize: 11,
                              color: "#556070",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {row.budgeted > 0
                              ? `${((row.actual / row.budgeted) * 100).toFixed(0)}%`
                              : "—"}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className={styles.chartLegend}>
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: "#2d5f94" }}
                    />
                    Budget
                  </span>
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: "#16a34a" }}
                    />
                    Actual (under)
                  </span>
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: "#dc2626" }}
                    />
                    Actual (over)
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.pieContainer}>
                <div
                  className={styles.pieChart}
                  style={{
                    background:
                      grandTotal > 0
                        ? `conic-gradient(${sectionTotals
                            .map((st, i) => {
                              const colors = [
                                "#2d5f94",
                                "#16a34a",
                                "#f59e0b",
                                "#ea580c",
                                "#8b5cf6",
                                "#06b6d4",
                                "#ec4899",
                                "#64748b",
                              ];
                              const startPct =
                                sectionTotals
                                  .slice(0, i)
                                  .reduce((s, x) => s + x.total, 0) /
                                grandTotal *
                                100;
                              const endPct = startPct + (st.total / grandTotal) * 100;
                              return `${colors[i % colors.length]} ${startPct}% ${endPct}%`;
                            })
                            .join(", ")})`
                        : "#e5e7eb",
                  }}
                >
                  <div className={styles.pieHole}>
                    <span className={styles.pieHoleLabel}>Total</span>
                    <span className={styles.pieHoleValue}>
                      {grandTotal >= 1000
                        ? `₱${(grandTotal / 1000).toFixed(0)}K`
                        : formatPHP(grandTotal)}
                    </span>
                  </div>
                </div>
                <div className={styles.pieLegend}>
                  {sectionTotals
                    .filter((st) => st.total > 0)
                    .map((st, i) => {
                      const colors = [
                        "#2d5f94",
                        "#16a34a",
                        "#f59e0b",
                        "#ea580c",
                        "#8b5cf6",
                        "#06b6d4",
                        "#ec4899",
                        "#64748b",
                      ];
                      return (
                        <div key={i} className={styles.pieLegendRow}>
                          <span
                            className={styles.legendDot}
                            style={{
                              backgroundColor: colors[i % colors.length],
                            }}
                          />
                          <span>{st.section}</span>
                          <strong>
                            {grandTotal > 0
                              ? `${((st.total / grandTotal) * 100).toFixed(1)}%`
                              : "—"}
                          </strong>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
