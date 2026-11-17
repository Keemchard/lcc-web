"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FinanceReport, ReportType } from "@/types/finance";
import { MONTHS, computeTotals } from "@/types/finance";
import adminStyles from "../AdminPages.module.scss";
import styles from "./Finance.module.scss";

type ReportWithId = FinanceReport & { id: string };

function formatPHP(amount: number) {
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function formatCompact(amount: number) {
  if (amount >= 1000000) return `₱${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₱${(amount / 1000).toFixed(1)}K`;
  return `₱${amount.toFixed(0)}`;
}

export default function FinanceListPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"dashboard" | "reports">("dashboard");
  const [filter, setFilter] = useState<"all" | ReportType>("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartMode, setChartMode] = useState<"bar" | "pie">("bar");

  useEffect(() => {
    fetch("/api/finance")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a: FinanceReport, b: FinanceReport) =>
          b.year !== a.year ? b.year - a.year : b.month - a.month
        );
        setReports(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this report?")) return;
    setDeleting(id);
    await fetch(`/api/finance/${id}`, { method: "DELETE" });
    setReports((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  };

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.type === filter);

  // Dashboard data
  const receiptsReports = reports.filter(
    (r) => r.type === "receipts" && r.year === selectedYear
  );
  const buildingReports = reports.filter(
    (r) => r.type === "building" && r.year === selectedYear
  );
  const allYearReports = reports.filter((r) => r.year === selectedYear);

  const years = [...new Set(reports.map((r) => r.year))].sort((a, b) => b - a);
  if (years.length === 0) years.push(new Date().getFullYear());

  // Monthly data for bar chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const receipt = receiptsReports.find((r) => r.month === i);
    const building = buildingReports.find((r) => r.month === i);
    const rTotals = receipt ? computeTotals(receipt) : null;
    const bTotals = building ? computeTotals(building) : null;
    return {
      month: MONTHS[i].slice(0, 3),
      income: (rTotals?.totalIncome ?? 0) + (bTotals?.totalIncome ?? 0),
      expenses: (rTotals?.totalExpenses ?? 0) + (bTotals?.totalExpenses ?? 0),
    };
  });

  const maxMonthly = Math.max(
    ...monthlyData.map((d) => Math.max(d.income, d.expenses)),
    1
  );

  // Category breakdown (aggregate all receipts for the year)
  const categoryMap = new Map<string, number>();
  receiptsReports.forEach((r) => {
    const totals = computeTotals(r);
    totals.categoryTotals.forEach((ct) => {
      if (ct.total > 0) {
        categoryMap.set(ct.category, (categoryMap.get(ct.category) ?? 0) + ct.total);
      }
    });
  });
  const categoryBreakdown = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxCategory = Math.max(...categoryBreakdown.map((c) => c[1]), 1);

  // Summary stats — separated by fund
  const generalTithes = receiptsReports.reduce((sum, r) => sum + computeTotals(r).totalIncome, 0);
  const buildingOfferings = buildingReports.reduce((sum, r) => sum + computeTotals(r).totalIncome, 0);
  const totalIncomeYear = generalTithes + buildingOfferings;

  const generalExpenses = receiptsReports.reduce((sum, r) => sum + computeTotals(r).totalExpenses, 0);
  const buildingExpenses = buildingReports.reduce((sum, r) => sum + computeTotals(r).totalExpenses, 0);
  const totalExpensesYear = generalExpenses + buildingExpenses;

  const latestReceipt = receiptsReports[0];
  const latestBuilding = buildingReports[0];
  const receiptsBalance = latestReceipt
    ? computeTotals(latestReceipt).balanceToForward
    : 0;
  const buildingBalance = latestBuilding
    ? computeTotals(latestBuilding).balanceToForward
    : 0;

  // All expenses, top 5 highlighted
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const visibleExpenses = showAllExpenses
    ? categoryBreakdown
    : categoryBreakdown.slice(0, 5);

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Finance</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={styles.exportYearButton}
            onClick={() => router.push("/admin/finance/budget")}
          >
            Budget planning
          </button>
          <button
            className={adminStyles.addButton}
            onClick={() => router.push("/admin/finance/new")}
          >
            New report
          </button>
        </div>
      </div>

      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${tab === "dashboard" ? styles.filterTabActive : ""}`}
          onClick={() => setTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`${styles.filterTab} ${tab === "reports" ? styles.filterTabActive : ""}`}
          onClick={() => setTab("reports")}
        >
          Reports
        </button>
      </div>

      {loading ? (
        <div className={adminStyles.emptyState}>Loading...</div>
      ) : tab === "dashboard" ? (
        <div>
          {/* Year selector */}
          <div className={styles.yearSelector}>
            {years.map((y) => (
              <button
                key={y}
                className={`${styles.yearButton} ${y === selectedYear ? styles.yearButtonActive : ""}`}
                onClick={() => setSelectedYear(y)}
              >
                {y}
              </button>
            ))}
            <button
              className={styles.exportYearButton}
              onClick={() =>
                router.push(`/admin/finance/export?year=${selectedYear}`)
              }
            >
              Export {selectedYear}
            </button>
          </div>

          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total tithes & offerings</p>
              <p className={styles.summaryValue}>{formatPHP(totalIncomeYear)}</p>
              <div className={styles.summaryBreakdown}>
                <span>General fund tithes: {formatPHP(generalTithes)}</span>
                <span>Building fund offerings: {formatPHP(buildingOfferings)}</span>
              </div>
              <p className={styles.summaryMeta}>{selectedYear} year to date</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total expenses</p>
              <p className={styles.summaryValue}>{formatPHP(totalExpensesYear)}</p>
              <div className={styles.summaryBreakdown}>
                <span>General fund: {formatPHP(generalExpenses)}</span>
                <span>Building fund: {formatPHP(buildingExpenses)}</span>
              </div>
              <p className={styles.summaryMeta}>{selectedYear} year to date</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>General fund balance</p>
              <p className={styles.summaryValue}>{formatPHP(receiptsBalance)}</p>
              <p className={styles.summaryMeta}>
                {latestReceipt
                  ? `As of ${MONTHS[latestReceipt.month]} ${latestReceipt.year}`
                  : "No data"}
              </p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Building fund balance</p>
              <p className={styles.summaryValue}>{formatPHP(buildingBalance)}</p>
              <p className={styles.summaryMeta}>
                {latestBuilding
                  ? `As of ${MONTHS[latestBuilding.month]} ${latestBuilding.year}`
                  : "No data"}
              </p>
            </div>
          </div>

          {/* Charts row */}
          <div className={styles.chartsRow}>
            {/* Monthly income vs expenses */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Monthly income vs expenses</h3>
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
                  <div className={styles.barChart}>
                    {monthlyData.map((d, i) => (
                      <div key={i} className={styles.barGroup}>
                        <div className={styles.barPair}>
                          <div
                            className={styles.barIncome}
                            style={{
                              height: `${(d.income / maxMonthly) * 160}px`,
                            }}
                            title={`Income: ${formatPHP(d.income)}`}
                          />
                          <div
                            className={styles.barExpense}
                            style={{
                              height: `${(d.expenses / maxMonthly) * 160}px`,
                            }}
                            title={`Expenses: ${formatPHP(d.expenses)}`}
                          />
                        </div>
                        <span className={styles.barLabel}>{d.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.chartLegend}>
                    <span className={styles.legendItem}>
                      <span
                        className={styles.legendDot}
                        style={{ backgroundColor: "#2d5f94" }}
                      />
                      Income
                    </span>
                    <span className={styles.legendItem}>
                      <span
                        className={styles.legendDot}
                        style={{ backgroundColor: "#e5484d" }}
                      />
                      Expenses
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.pieContainer}>
                  <div
                    className={styles.pieChart}
                    style={{
                      background: totalIncomeYear + totalExpensesYear > 0
                        ? `conic-gradient(#2d5f94 0% ${(totalIncomeYear / (totalIncomeYear + totalExpensesYear)) * 100}%, #e5484d ${(totalIncomeYear / (totalIncomeYear + totalExpensesYear)) * 100}% 100%)`
                        : "#e5e7eb",
                    }}
                  >
                    <div className={styles.pieHole}>
                      <span className={styles.pieHoleLabel}>Net</span>
                      <span className={styles.pieHoleValue}>
                        {formatCompact(totalIncomeYear - totalExpensesYear)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.pieLegend}>
                    <div className={styles.pieLegendRow}>
                      <span
                        className={styles.legendDot}
                        style={{ backgroundColor: "#2d5f94" }}
                      />
                      <span>Income</span>
                      <strong>{formatPHP(totalIncomeYear)}</strong>
                    </div>
                    <div className={styles.pieLegendRow}>
                      <span
                        className={styles.legendDot}
                        style={{ backgroundColor: "#e5484d" }}
                      />
                      <span>Expenses</span>
                      <strong>{formatPHP(totalExpensesYear)}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Expense breakdown */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Where the money goes</h3>
              {categoryBreakdown.length === 0 ? (
                <p className={styles.chartEmpty}>No expense data yet</p>
              ) : (
                <div className={styles.horizontalBars}>
                  {categoryBreakdown.map(([cat, amount], i) => (
                    <div key={i} className={styles.hBarRow}>
                      <span className={styles.hBarLabel}>
                        {cat.replace("Ministry - ", "")}
                      </span>
                      <div className={styles.hBarTrack}>
                        <div
                          className={styles.hBarFill}
                          style={{
                            width: `${(amount / maxCategory) * 100}%`,
                          }}
                        />
                      </div>
                      <span className={styles.hBarValue}>
                        {formatCompact(amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Spending categories list */}
          {categoryBreakdown.length > 0 && (
            <div className={styles.chartCard} style={{ marginTop: 24 }}>
              <h3 className={styles.chartTitle}>
                Spending categories — {selectedYear}
              </h3>
              <table className={adminStyles.table}>
                <thead>
                  <tr>
                    <th className={adminStyles.th}>#</th>
                    <th className={adminStyles.th}>Category</th>
                    <th
                      className={adminStyles.th}
                      style={{ textAlign: "right" }}
                    >
                      Amount
                    </th>
                    <th
                      className={adminStyles.th}
                      style={{ textAlign: "right" }}
                    >
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleExpenses.map(([cat, amount], i) => (
                    <tr
                      key={i}
                      style={i < 5 ? { fontWeight: 500 } : undefined}
                    >
                      <td className={adminStyles.td}>{i + 1}</td>
                      <td className={adminStyles.td}>{cat}</td>
                      <td
                        className={`${adminStyles.td} ${styles.amountCell}`}
                      >
                        {formatPHP(amount)}
                      </td>
                      <td
                        className={`${adminStyles.td} ${styles.amountCell}`}
                      >
                        {totalExpensesYear > 0
                          ? `${((amount / totalExpensesYear) * 100).toFixed(1)}%`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categoryBreakdown.length > 5 && (
                <button
                  className={styles.addButton}
                  style={{ marginTop: 12 }}
                  onClick={() => setShowAllExpenses((v) => !v)}
                >
                  {showAllExpenses
                    ? "Show top 5 only"
                    : `See all ${categoryBreakdown.length} categories`}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Reports tab */
        <div>
          <div className={styles.filterTabs} style={{ marginTop: 0 }}>
            {(
              [
                ["all", "All"],
                ["receipts", "Receipts & Disbursements"],
                ["building", "Church Building"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                className={`${styles.filterTab} ${filter === key ? styles.filterTabActive : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className={adminStyles.emptyState}>
              No finance reports yet. Create one to get started.
            </div>
          ) : (
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th className={adminStyles.th}>Period</th>
                  <th className={adminStyles.th}>Type</th>
                  <th
                    className={adminStyles.th}
                    style={{ textAlign: "right" }}
                  >
                    Total income
                  </th>
                  <th
                    className={adminStyles.th}
                    style={{ textAlign: "right" }}
                  >
                    Total expenses
                  </th>
                  <th
                    className={adminStyles.th}
                    style={{ textAlign: "right" }}
                  >
                    Balance
                  </th>
                  <th className={adminStyles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((report) => {
                  const totals = computeTotals(report);
                  return (
                    <tr key={report.id}>
                      <td className={adminStyles.td}>
                        {MONTHS[report.month]} {report.year}
                      </td>
                      <td className={adminStyles.td}>
                        <span
                          className={`${styles.typeBadge} ${report.type === "receipts" ? styles.typeReceipts : styles.typeBuilding}`}
                        >
                          {report.type === "receipts"
                            ? "Receipts"
                            : "Building"}
                        </span>
                      </td>
                      <td
                        className={`${adminStyles.td} ${styles.amountCell}`}
                      >
                        {formatPHP(totals.totalCashAvailable)}
                      </td>
                      <td
                        className={`${adminStyles.td} ${styles.amountCell}`}
                      >
                        {formatPHP(totals.totalExpenses)}
                      </td>
                      <td
                        className={`${adminStyles.td} ${styles.amountCell}`}
                      >
                        {formatPHP(totals.balanceToForward)}
                      </td>
                      <td className={adminStyles.td}>
                        <div className={adminStyles.actions}>
                          <button
                            className={adminStyles.editButton}
                            onClick={() =>
                              router.push(`/admin/finance/${report.id}`)
                            }
                          >
                            View
                          </button>
                          <button
                            className={adminStyles.deleteButton}
                            onClick={() => handleDelete(report.id)}
                            disabled={deleting === report.id}
                          >
                            {deleting === report.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
