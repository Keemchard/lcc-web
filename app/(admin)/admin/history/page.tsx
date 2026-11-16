"use client";

import { useEffect, useState } from "react";
import styles from "../AdminPages.module.scss";

type ChangeEntry = {
  id: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  action: "create" | "update" | "delete";
  changes?: Record<string, { before: unknown; after: unknown }>;
  performedBy: string;
  performedByEmail: string;
  performedAt: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<ChangeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }, []);

  const badgeClass = (action: string) => {
    if (action === "create") return `${styles.badge} ${styles.badgeCreate}`;
    if (action === "update") return `${styles.badge} ${styles.badgeUpdate}`;
    return `${styles.badge} ${styles.badgeDelete}`;
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Change History</h1>

      {loading ? (
        <div className={styles.emptyState}>Loading...</div>
      ) : entries.length === 0 ? (
        <div className={styles.emptyState}>No changes recorded yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Action</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>By</th>
              <th className={styles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className={styles.td}>
                  <span className={styles.historyMeta}>
                    {entry.performedAt
                      ? formatDate(entry.performedAt)
                      : "—"}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={badgeClass(entry.action)}>
                    {entry.action}
                  </span>
                </td>
                <td className={styles.td}>{entry.entityType}</td>
                <td className={styles.td}>{entry.entityTitle}</td>
                <td className={styles.td}>
                  <span className={styles.historyMeta}>
                    {entry.performedByEmail}
                  </span>
                </td>
                <td className={styles.td}>
                  {entry.changes && (
                    <button
                      className={styles.editButton}
                      onClick={() =>
                        setExpandedId(
                          expandedId === entry.id ? null : entry.id
                        )
                      }
                    >
                      {expandedId === entry.id ? "Hide" : "View"}
                    </button>
                  )}
                  {expandedId === entry.id && entry.changes && (
                    <div className={styles.changesDiff}>
                      {Object.entries(entry.changes).map(([key, val]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {JSON.stringify(val.before)}{" "}
                          → {JSON.stringify(val.after)}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
