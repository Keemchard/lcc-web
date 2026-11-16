"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { FinanceReport } from "@/types/finance";
import { MONTHS, computeTotals } from "@/types/finance";
import styles from "../../Finance.module.scss";

function formatPHP(amount: number) {
  return amount.toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

export default function PrintFinanceReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/finance/${id}`)
      .then((res) => res.json())
      .then((data: FinanceReport) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!report) return <div style={{ padding: 40, textAlign: "center" }}>Report not found.</div>;

  const totals = computeTotals(report);
  const monthName = MONTHS[report.month];
  const reportTitle =
    report.type === "receipts"
      ? `STATEMENT OF RECEIPTS AND DISBURSEMENTS FOR ${monthName.toUpperCase()} ${report.year}`
      : `OFFERING - CHURCH BUILDING FOR ${monthName.toUpperCase()} ${report.year}`;

  const incomeLabel = report.type === "receipts" ? "Tithes" : "Offerings";

  return (
    <div className={styles.printView}>
      <div className={styles.printActions}>
        <button
          className={styles.addButton}
          style={{ padding: "8px 20px", fontSize: 14 }}
          onClick={() => router.push(`/admin/finance/${id}`)}
        >
          Back to edit
        </button>
        <button
          className={styles.addButton}
          style={{ padding: "8px 20px", fontSize: 14 }}
          onClick={() => window.print()}
        >
          Print
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
        <div className={styles.printChurchName}>Livingwater Community Church</div>
        <div className={styles.printReportTitle}>{reportTitle}</div>
      </div>

      {/* Income Section */}
      <table className={styles.printTable}>
        <tbody>
          <tr>
            <td>Balance forwarded for the month of {monthName} {report.year}</td>
            <td></td>
            <td style={{ fontWeight: 600 }}>{formatPHP(report.balanceForwarded)}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ fontWeight: 600, paddingTop: 12 }}>
              Add: {incomeLabel}
            </td>
          </tr>
          {report.incomeEntries.map((entry, i) => (
            <tr key={i}>
              <td style={{ paddingLeft: 24 }}>{entry.date}</td>
              <td style={{ textAlign: "right" }}>{formatPHP(entry.amount)}</td>
              <td></td>
            </tr>
          ))}
          <tr className={styles.printSubtotalRow}>
            <td>Total {incomeLabel}</td>
            <td></td>
            <td>{formatPHP(totals.totalIncome)}</td>
          </tr>

          {report.type === "receipts" &&
            report.additionalIncome.map((item, i) => (
              <tr key={`ai-${i}`}>
                <td>{item.label}</td>
                <td></td>
                <td>{formatPHP(item.amount)}</td>
              </tr>
            ))}

          <tr className={styles.printSubtotalRow}>
            <td>Total Cash Available</td>
            <td></td>
            <td style={{ fontWeight: 700 }}>{formatPHP(totals.totalCashAvailable)}</td>
          </tr>

          {/* Disbursements */}
          <tr>
            <td colSpan={3} style={{ fontWeight: 600, paddingTop: 16 }}>
              Less: Cash Disbursement
            </td>
          </tr>

          {report.disbursements.map((cat, catIdx) => (
            <>
              <tr key={`cat-${catIdx}`} className={styles.printCategoryRow}>
                <td colSpan={2}>{cat.category}</td>
                <td></td>
              </tr>
              {cat.items.map((item, itemIdx) => (
                <tr key={`item-${catIdx}-${itemIdx}`}>
                  <td style={{ paddingLeft: 24 }}>{item.label}</td>
                  <td style={{ textAlign: "right" }}>{formatPHP(item.amount)}</td>
                  <td></td>
                </tr>
              ))}
              <tr className={styles.printSubtotalRow}>
                <td style={{ paddingLeft: 24 }}>Subtotal — {cat.category}</td>
                <td></td>
                <td>{formatPHP(totals.categoryTotals[catIdx]?.total ?? 0)}</td>
              </tr>
            </>
          ))}

          <tr className={styles.printSubtotalRow}>
            <td style={{ fontWeight: 600 }}>Total Expense</td>
            <td></td>
            <td style={{ fontWeight: 600 }}>{formatPHP(totals.totalExpenses)}</td>
          </tr>

          <tr className={styles.printTotalRow}>
            <td>
              Total Balance to be forwarded for the month of {monthName}{" "}
              {report.year}
            </td>
            <td></td>
            <td>{formatPHP(totals.balanceToForward)}</td>
          </tr>
        </tbody>
      </table>

      {/* Signatories */}
      <div className={styles.printSignatory}>
        <div className={styles.printSignatoryBlock}>
          <div className={styles.sigLabel}>Prepared by:</div>
          <div className={styles.sigName}>{report.preparedBy.name}</div>
          <div className={styles.sigTitle}>{report.preparedBy.title}</div>
        </div>
        <div className={styles.printSignatoryBlock}>
          <div className={styles.sigLabel}>Attested by:</div>
          <div className={styles.sigName}>{report.attestedBy.name}</div>
          <div className={styles.sigTitle}>{report.attestedBy.title}</div>
        </div>
      </div>
    </div>
  );
}
