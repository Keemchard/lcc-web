"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { FinanceReport } from "@/types/finance";
import { MONTHS, computeTotals } from "@/types/finance";
import styles from "../Finance.module.scss";

type ReportWithId = FinanceReport & { id: string };

function formatPHP(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function YearlyExportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const [reports, setReports] = useState<ReportWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance")
      .then((res) => res.json())
      .then((data) => {
        const arr = (Array.isArray(data) ? data : []) as ReportWithId[];
        arr.sort((a, b) => a.month - b.month);
        setReports(arr.filter((r) => r.year === year));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year]);

  const receipts = reports.filter((r) => r.type === "receipts");
  const building = reports.filter((r) => r.type === "building");

  const yearTotalIncome = receipts.reduce(
    (s, r) => s + computeTotals(r).totalIncome,
    0
  );
  const yearTotalExpenses = receipts.reduce(
    (s, r) => s + computeTotals(r).totalExpenses,
    0
  );
  const buildingTotalIncome = building.reduce(
    (s, r) => s + computeTotals(r).totalIncome,
    0
  );
  const buildingTotalExpenses = building.reduce(
    (s, r) => s + computeTotals(r).totalExpenses,
    0
  );

  // Aggregate categories across all months
  const categoryMap = new Map<string, number>();
  receipts.forEach((r) => {
    r.disbursements.forEach((cat) => {
      const total = cat.items.reduce((s, i) => s + i.amount, 0);
      if (total > 0) {
        categoryMap.set(
          cat.category,
          (categoryMap.get(cat.category) ?? 0) + total
        );
      }
    });
  });
  const categoryBreakdown = [...categoryMap.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  if (loading) {
    return (
      <div className={styles.printView}>
        <p style={{ textAlign: "center", padding: 40 }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.printView}>
      <div className={styles.printActions}>
        <button
          className={styles.yearButton}
          onClick={() => router.push("/admin/finance")}
        >
          Back
        </button>
        <button
          className={styles.yearButtonActive}
          onClick={() => window.print()}
        >
          Print / Export
        </button>
      </div>

      {/* Header */}
      <div className={styles.printHeader}>
        <Image
          src="/images/lcc-logo-icon.png"
          alt="LCC"
          width={60}
          height={60}
          className={styles.printLogo}
        />
        <p className={styles.printChurchName}>Livingwater Community Church</p>
        <p className={styles.printReportTitle}>
          Annual financial summary for {year}
        </p>
      </div>

      {/* Monthly Summary — Receipts */}
      <h3 style={{ fontSize: 14, fontWeight: 600, margin: "24px 0 8px" }}>
        Statement of receipts and disbursements
      </h3>
      <table className={styles.printTable}>
        <thead>
          <tr>
            <th>Month</th>
            <th>Balance fwd</th>
            <th>Tithes</th>
            <th>Other income</th>
            <th>Total available</th>
            <th>Total expenses</th>
            <th>End balance</th>
          </tr>
        </thead>
        <tbody>
          {receipts.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                No receipts data for {year}
              </td>
            </tr>
          ) : (
            <>
              {receipts.map((r) => {
                const t = computeTotals(r);
                return (
                  <tr key={r.id}>
                    <td>{MONTHS[r.month]}</td>
                    <td>{formatPHP(r.balanceForwarded)}</td>
                    <td>{formatPHP(t.totalIncome)}</td>
                    <td>{formatPHP(t.totalAdditional)}</td>
                    <td>{formatPHP(t.totalCashAvailable)}</td>
                    <td>{formatPHP(t.totalExpenses)}</td>
                    <td>{formatPHP(t.balanceToForward)}</td>
                  </tr>
                );
              })}
              <tr className={styles.printTotalRow}>
                <td>Total</td>
                <td></td>
                <td>{formatPHP(yearTotalIncome)}</td>
                <td>
                  {formatPHP(
                    receipts.reduce(
                      (s, r) => s + computeTotals(r).totalAdditional,
                      0
                    )
                  )}
                </td>
                <td></td>
                <td>{formatPHP(yearTotalExpenses)}</td>
                <td></td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Monthly Summary — Building */}
      <h3 style={{ fontSize: 14, fontWeight: 600, margin: "32px 0 8px" }}>
        Offering — Church building
      </h3>
      <table className={styles.printTable}>
        <thead>
          <tr>
            <th>Month</th>
            <th>Balance fwd</th>
            <th>Offerings</th>
            <th>Total available</th>
            <th>Total expenses</th>
            <th>End balance</th>
          </tr>
        </thead>
        <tbody>
          {building.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                No building fund data for {year}
              </td>
            </tr>
          ) : (
            <>
              {building.map((r) => {
                const t = computeTotals(r);
                return (
                  <tr key={r.id}>
                    <td>{MONTHS[r.month]}</td>
                    <td>{formatPHP(r.balanceForwarded)}</td>
                    <td>{formatPHP(t.totalIncome)}</td>
                    <td>{formatPHP(t.totalCashAvailable)}</td>
                    <td>{formatPHP(t.totalExpenses)}</td>
                    <td>{formatPHP(t.balanceToForward)}</td>
                  </tr>
                );
              })}
              <tr className={styles.printTotalRow}>
                <td>Total</td>
                <td></td>
                <td>{formatPHP(buildingTotalIncome)}</td>
                <td></td>
                <td>{formatPHP(buildingTotalExpenses)}</td>
                <td></td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Expense Breakdown */}
      {categoryBreakdown.length > 0 && (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "32px 0 8px" }}>
            Expense breakdown by category — {year}
          </h3>
          <table className={styles.printTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map(([cat, amount], i) => (
                <tr key={i}>
                  <td>{cat}</td>
                  <td>{formatPHP(amount)}</td>
                  <td>
                    {yearTotalExpenses > 0
                      ? `${((amount / yearTotalExpenses) * 100).toFixed(1)}%`
                      : "—"}
                  </td>
                </tr>
              ))}
              <tr className={styles.printTotalRow}>
                <td>Total</td>
                <td>{formatPHP(yearTotalExpenses)}</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Footer */}
      <p
        style={{
          fontSize: 10,
          color: "#888",
          textAlign: "center",
          marginTop: 48,
          borderTop: "1px solid #ddd",
          paddingTop: 12,
        }}
      >
        Livingwater Community Church — Annual Financial Summary {year} —
        Generated {new Date().toLocaleDateString("en-PH")}
      </p>
    </div>
  );
}
