"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnnualBudget } from "@/types/budget";
import { computeBudgetTotals } from "@/types/budget";
import adminStyles from "../../AdminPages.module.scss";
import styles from "../Finance.module.scss";

type BudgetWithId = AnnualBudget & { id: string };

function formatPHP(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function BudgetListPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<BudgetWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/finance/budget")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        arr.sort(
          (a: AnnualBudget, b: AnnualBudget) => b.year - a.year
        );
        setBudgets(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this budget?")) return;
    setDeleting(id);
    await fetch(`/api/finance/budget/${id}`, { method: "DELETE" });
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    setDeleting(null);
  };

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Budget planning</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={adminStyles.cancelButton}
            onClick={() => router.push("/admin/finance")}
          >
            Back to finance
          </button>
          <button
            className={adminStyles.addButton}
            onClick={() => router.push("/admin/finance/budget/new")}
          >
            New budget
          </button>
        </div>
      </div>

      {loading ? (
        <div className={adminStyles.emptyState}>Loading...</div>
      ) : budgets.length === 0 ? (
        <div className={adminStyles.emptyState}>
          No annual budgets yet. Create one to start planning.
        </div>
      ) : (
        <div className={styles.summaryGrid}>
          {budgets.map((budget) => {
            const { sectionTotals, grandTotal } = computeBudgetTotals(budget);
            return (
              <div key={budget.id} className={styles.summaryCard}>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#0b1f33",
                    marginBottom: 4,
                  }}
                >
                  {budget.year}
                </p>
                <p className={styles.summaryLabel}>Annual budget</p>
                <p className={styles.summaryValue}>{formatPHP(grandTotal)}</p>
                <p className={styles.summaryMeta}>
                  {sectionTotals.length} sections
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 16,
                  }}
                >
                  <button
                    className={adminStyles.editButton}
                    onClick={() =>
                      router.push(`/admin/finance/budget/${budget.id}`)
                    }
                  >
                    View
                  </button>
                  <button
                    className={adminStyles.deleteButton}
                    onClick={() => handleDelete(budget.id)}
                    disabled={deleting === budget.id}
                  >
                    {deleting === budget.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
