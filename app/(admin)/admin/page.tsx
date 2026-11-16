import Link from "next/link";
import styles from "./AdminPages.module.scss";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <p style={{ color: "#728094", marginTop: "0.5rem" }}>
        Welcome to the LCC admin panel. Manage your church website content here.
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statTitle}>Carousel Slides</p>
          <p>Manage hero carousel images and content.</p>
          <Link href="/admin/carousels" className={styles.statLink}>
            Manage Slides &rarr;
          </Link>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statTitle}>Service Times</p>
          <p>Update worship schedules and event details.</p>
          <Link href="/admin/service-times" className={styles.statLink}>
            Manage Services &rarr;
          </Link>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statTitle}>Change History</p>
          <p>View a log of all content changes.</p>
          <Link href="/admin/history" className={styles.statLink}>
            View History &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
