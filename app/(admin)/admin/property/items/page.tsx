"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AssetItem, AssetCategory, AssetCondition } from "@/types/property";
import { ASSET_CATEGORIES, ASSET_CONDITIONS } from "@/types/property";
import adminStyles from "../../AdminPages.module.scss";
import styles from "../Property.module.scss";

type AssetWithId = AssetItem & { id: string };

const conditionColors: Record<string, string> = {
  Good: "#16a34a",
  Fair: "#f59e0b",
  "Needs Repair": "#ea580c",
  Condemned: "#dc2626",
};

function formatPHP(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function PropertyItemsPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | AssetCategory>("all");
  const [condFilter, setCondFilter] = useState<"all" | AssetCondition>("all");

  useEffect(() => {
    fetch("/api/property")
      .then((r) => r.json())
      .then((data) => {
        setAssets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    await fetch(`/api/property/${id}`, { method: "DELETE" });
    setAssets((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  const filtered = assets.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && a.category !== catFilter) return false;
    if (condFilter !== "all" && a.condition !== condFilter) return false;
    return true;
  });

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Property</h1>
        <button
          className={adminStyles.addButton}
          onClick={() => router.push("/admin/property/items/new")}
        >
          Add item
        </button>
      </div>

      <div className={styles.propertyTabs}>
        <Link href="/admin/property" className={styles.propertyTab}>
          Dashboard
        </Link>
        <Link href="/admin/property/items" className={`${styles.propertyTab} ${styles.propertyTabActive}`}>
          Items
        </Link>
        <Link href="/admin/property/borrow" className={styles.propertyTab}>
          Borrow log
        </Link>
        <Link href="/admin/property/export" className={styles.propertyTab}>
          Export
        </Link>
      </div>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value as "all" | AssetCategory)}
        >
          <option value="all">All categories</option>
          {ASSET_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={condFilter}
          onChange={(e) => setCondFilter(e.target.value as "all" | AssetCondition)}
        >
          <option value="all">All conditions</option>
          {ASSET_CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={adminStyles.emptyState}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={adminStyles.emptyState}>
          {assets.length === 0 ? "No items yet. Add one to get started." : "No items match your filters."}
        </div>
      ) : (
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th className={adminStyles.th}>Name</th>
              <th className={adminStyles.th}>Category</th>
              <th className={adminStyles.th}>Qty</th>
              <th className={adminStyles.th}>Condition</th>
              <th className={adminStyles.th}>Location</th>
              <th className={adminStyles.th} style={{ textAlign: "right" }}>Value</th>
              <th className={adminStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr key={asset.id}>
                <td className={adminStyles.td}>{asset.name}</td>
                <td className={adminStyles.td}>{asset.category}</td>
                <td className={adminStyles.td}>{asset.quantity}</td>
                <td className={adminStyles.td}>
                  <span
                    className={styles.conditionBadge}
                    style={{ backgroundColor: conditionColors[asset.condition] || "#728094" }}
                  >
                    {asset.condition}
                  </span>
                </td>
                <td className={adminStyles.td}>{asset.location}</td>
                <td className={`${adminStyles.td} ${styles.amountCell}`}>
                  {formatPHP(asset.value || 0)}
                </td>
                <td className={adminStyles.td}>
                  <div className={adminStyles.actions}>
                    <button
                      className={adminStyles.editButton}
                      onClick={() => router.push(`/admin/property/items/${asset.id}`)}
                    >
                      View
                    </button>
                    <button
                      className={adminStyles.deleteButton}
                      onClick={() => handleDelete(asset.id)}
                      disabled={deleting === asset.id}
                    >
                      {deleting === asset.id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
