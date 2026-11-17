"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AssetItem, BorrowRecord } from "@/types/property";
import { ASSET_CONDITIONS, ASSET_CATEGORIES } from "@/types/property";
import adminStyles from "../AdminPages.module.scss";
import styles from "./Property.module.scss";

type AssetWithId = AssetItem & { id: string };
type BorrowWithId = BorrowRecord & { id: string };

const conditionColors: Record<string, string> = {
  Good: "#16a34a",
  Fair: "#f59e0b",
  "Needs Repair": "#ea580c",
  Condemned: "#dc2626",
};

function formatPHP(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function PropertyDashboard() {
  const [assets, setAssets] = useState<AssetWithId[]>([]);
  const [borrows, setBorrows] = useState<BorrowWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/property").then((r) => r.json()),
      fetch("/api/property/borrow").then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setAssets(Array.isArray(a) ? a : []);
        setBorrows(Array.isArray(b) ? b : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalItems = assets.reduce((s, a) => s + (a.quantity || 1), 0);
  const totalValue = assets.reduce((s, a) => s + (a.value || 0), 0);
  const needsRepair = assets.filter(
    (a) => a.condition === "Needs Repair" || a.condition === "Condemned"
  ).length;
  const currentlyBorrowed = borrows.filter((b) => b.status === "Borrowed").length;

  const conditionCounts = ASSET_CONDITIONS.map((c) => ({
    label: c,
    count: assets.filter((a) => a.condition === c).length,
    color: conditionColors[c],
  }));
  const maxCondition = Math.max(...conditionCounts.map((c) => c.count), 1);

  const categoryCounts = ASSET_CATEGORIES.map((c) => ({
    label: c,
    count: assets.filter((a) => a.category === c).length,
  })).filter((c) => c.count > 0);
  const maxCategory = Math.max(...categoryCounts.map((c) => c.count), 1);

  const recentBorrows = [...borrows]
    .sort((a, b) => (b.dateOut || "").localeCompare(a.dateOut || ""))
    .slice(0, 5);

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Property</h1>
        <Link href="/admin/property/items/new" className={adminStyles.addButton}>
          Add item
        </Link>
      </div>

      <div className={styles.propertyTabs}>
        <Link href="/admin/property" className={`${styles.propertyTab} ${styles.propertyTabActive}`}>
          Dashboard
        </Link>
        <Link href="/admin/property/items" className={styles.propertyTab}>
          Items
        </Link>
        <Link href="/admin/property/borrow" className={styles.propertyTab}>
          Borrow log
        </Link>
        <Link href="/admin/property/export" className={styles.propertyTab}>
          Export
        </Link>
      </div>

      {loading ? (
        <div className={adminStyles.emptyState}>Loading...</div>
      ) : (
        <>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total items</p>
              <p className={styles.summaryValue}>{totalItems}</p>
              <p className={styles.summaryMeta}>{assets.length} unique assets</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total value</p>
              <p className={styles.summaryValue}>{formatPHP(totalValue)}</p>
              <p className={styles.summaryMeta}>All assets combined</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Needs attention</p>
              <p className={styles.summaryValue}>{needsRepair}</p>
              <p className={styles.summaryMeta}>Needs repair or condemned</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Currently borrowed</p>
              <p className={styles.summaryValue}>{currentlyBorrowed}</p>
              <p className={styles.summaryMeta}>{borrows.length} total records</p>
            </div>
          </div>

          <div className={styles.chartsRow}>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Condition breakdown</h3>
              <div className={styles.horizontalBars}>
                {conditionCounts.map((c) => (
                  <div key={c.label} className={styles.hBarRow}>
                    <span className={styles.hBarLabel}>{c.label}</span>
                    <div className={styles.hBarTrack}>
                      <div
                        className={styles.hBarFill}
                        style={{
                          width: `${(c.count / maxCondition) * 100}%`,
                          backgroundColor: c.color,
                        }}
                      />
                    </div>
                    <span className={styles.hBarValue}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>By category</h3>
              {categoryCounts.length === 0 ? (
                <p style={{ color: "#728094", fontSize: 14, textAlign: "center", padding: 24 }}>
                  No items yet
                </p>
              ) : (
                <div className={styles.horizontalBars}>
                  {categoryCounts.map((c) => (
                    <div key={c.label} className={styles.hBarRow}>
                      <span className={styles.hBarLabel}>{c.label}</span>
                      <div className={styles.hBarTrack}>
                        <div
                          className={styles.hBarFill}
                          style={{
                            width: `${(c.count / maxCategory) * 100}%`,
                            backgroundColor: "#2d5f94",
                          }}
                        />
                      </div>
                      <span className={styles.hBarValue}>{c.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {recentBorrows.length > 0 && (
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Recent borrow activity</h3>
              <div className={styles.recentList}>
                {recentBorrows.map((b) => (
                  <div key={b.id} className={styles.recentItem}>
                    <div>
                      <strong>{b.assetName}</strong> — {b.borrower}
                      <br />
                      <span className={styles.recentMeta}>{b.purpose}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        className={styles.conditionBadge}
                        style={{
                          backgroundColor:
                            b.status === "Borrowed" ? "#f59e0b" : "#16a34a",
                        }}
                      >
                        {b.status}
                      </span>
                      <br />
                      <span className={styles.recentMeta}>{b.dateOut}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
