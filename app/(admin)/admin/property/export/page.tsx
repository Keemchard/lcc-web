"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { AssetItem } from "@/types/property";
import styles from "../Property.module.scss";

type AssetWithId = AssetItem & { id: string };

function formatPHP(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function PropertyExportPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/property")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a: AssetWithId, b: AssetWithId) =>
          (a.category || "").localeCompare(b.category || "")
        );
        setAssets(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalValue = assets.reduce((s, a) => s + (a.value || 0), 0);
  const totalQty = assets.reduce((s, a) => s + (a.quantity || 1), 0);
  const today = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <button className={styles.backBtn} onClick={() => router.push("/admin/property")}>
          Back
        </button>
        <button className={styles.printBtn} onClick={() => window.print()}>
          Print / Export
        </button>
      </div>

      <div className={styles.printHeader}>
        <Image
          src="/images/lcc-logo-icon.png"
          alt="LCC"
          width={60}
          height={60}
          className={styles.printLogo}
        />
        <p className={styles.printChurchName}>Livingwater Community Church</p>
        <p className={styles.printReportTitle}>Property inventory as of {today}</p>
      </div>

      <table className={styles.printTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Condition</th>
            <th>Location</th>
            <th>Date acquired</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, i) => (
            <tr key={asset.id}>
              <td>{i + 1}</td>
              <td>{asset.name}</td>
              <td>{asset.category}</td>
              <td>{asset.quantity}</td>
              <td>{asset.condition}</td>
              <td>{asset.location}</td>
              <td>{asset.dateAcquired || "—"}</td>
              <td>{formatPHP(asset.value || 0)}</td>
            </tr>
          ))}
          <tr className={styles.printTotalRow}>
            <td></td>
            <td>Total</td>
            <td></td>
            <td>{totalQty}</td>
            <td></td>
            <td></td>
            <td></td>
            <td>{formatPHP(totalValue)}</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.printSignatory}>
        <div className={styles.printSignatoryBlock}>
          <p className={styles.sigLabel}>Certified by:</p>
          <p className={styles.sigName}>Rhea Bago</p>
          <p className={styles.sigTitle}>Property Custodian Head, LCC</p>
        </div>
        <div className={styles.printSignatoryBlock}>
          <p className={styles.sigLabel}>Noted by:</p>
          <p className={styles.sigName}>Marites Luis</p>
          <p className={styles.sigTitle}>Auditor, LCC</p>
        </div>
      </div>

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
        Livingwater Community Church — Property Inventory — Generated {today}
      </p>
    </div>
  );
}
