import { FC } from "react";
import styles from "./Service.module.scss";
import ServiceTimeCards from "./ServiceTimeCards";
import { getServiceTimes } from "@/lib/firestore/serviceTimes";
import serviceTimeConstants from "@/constants/serviceTime";
import Link from "next/link";

const ServiceTime: FC = async () => {
  let serviceTimes = await getServiceTimes();

  const useFallback = serviceTimes.length === 0;

  return (
    <section className={styles.container}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Our schedule</span>
        <h4 className={styles.title}>Service times</h4>
        <p className={styles.subtitle}>
          Gather with us as we worship God, study His Word, and encourage one
          another through Christ-centered fellowship.
        </p>
      </div>

      {useFallback ? (
        <ServiceTimeCards fallbackData={serviceTimeConstants.slice(0, 3)} />
      ) : (
        <ServiceTimeCards firestoreData={serviceTimes.slice(0, 3)} />
      )}

      <Link href="/service-times" className={styles.viewAllButton}>
        View all services &rarr;
      </Link>
    </section>
  );
};

export default ServiceTime;
