"use client";

import { useEffect, useState } from "react";
import styles from "../AdminPages.module.scss";

type UserEntry = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: { _seconds: number };
};

function formatDate(seconds: number) {
  return new Date(seconds * 1000).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const msg =
      action === "approve"
        ? "Approve this user as admin?"
        : "Reject and remove this user?";
    if (!confirm(msg)) return;

    setActionLoading(id);
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (action === "approve") {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: "admin" } : u))
      );
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
    setActionLoading(null);
  };

  const pending = users.filter((u) => u.role === "pending");
  const admins = users.filter((u) => u.role === "admin" || u.role === "supreme_admin");

  return (
    <div>
      <h1 className={styles.pageTitle}>User Management</h1>

      {loading ? (
        <div className={styles.emptyState}>Loading...</div>
      ) : (
        <>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              marginTop: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Pending Approval ({pending.length})
          </h2>

          {pending.length === 0 ? (
            <div className={styles.emptyState}>No pending users.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Signed Up</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.td}>{user.displayName}</td>
                    <td className={styles.td}>{user.email}</td>
                    <td className={styles.td}>
                      {user.createdAt
                        ? formatDate(user.createdAt._seconds)
                        : "—"}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.statusPending}>Pending</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button
                          className={styles.approveButton}
                          onClick={() => handleAction(user.id, "approve")}
                          disabled={actionLoading === user.id}
                        >
                          Approve
                        </button>
                        <button
                          className={styles.rejectButton}
                          onClick={() => handleAction(user.id, "reject")}
                          disabled={actionLoading === user.id}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              marginTop: "2rem",
              marginBottom: "1rem",
            }}
          >
            Approved Admins ({admins.length})
          </h2>

          {admins.length === 0 ? (
            <div className={styles.emptyState}>No admins yet.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.td}>{user.displayName}</td>
                    <td className={styles.td}>{user.email}</td>
                    <td className={styles.td}>
                      <span className={styles.statusApproved}>
                        {user.role === "supreme_admin"
                          ? "Supreme Admin"
                          : "Admin"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
