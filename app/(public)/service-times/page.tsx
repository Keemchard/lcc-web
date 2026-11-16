import type { Metadata } from "next";
import { getServiceTimes } from "@/lib/firestore/serviceTimes";
import serviceTimeConstants from "@/constants/serviceTime";
import ServiceTimeCards from "../Home/sections/ServiceTime/ServiceTimeCards";
import styles from "./ServiceTimes.module.scss";

export const metadata: Metadata = {
  title: "Service Times",
  description:
    "View all service times at Livingwater Community Church in Tanza, Cavite.",
};

export default async function ServiceTimesPage() {
  const serviceTimes = await getServiceTimes();
  const useFallback = serviceTimes.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>LIVINGWATER COMMUNITY CHURCH</p>
        <h1 className={styles.heading}>Service Times</h1>
        <p className={styles.subtitle}>
          Gather with us as we worship God, study His Word, and encourage one
          another through Christ-centered fellowship.
        </p>
      </div>

      <section className={styles.content}>
        {useFallback ? (
          <ServiceTimeCards fallbackData={serviceTimeConstants} />
        ) : (
          <ServiceTimeCards firestoreData={serviceTimes} />
        )}
      </section>
    </div>
  );
}
