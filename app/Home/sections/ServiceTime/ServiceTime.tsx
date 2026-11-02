"use client";

import { FC } from "react";
import styles from "./Service.module.scss";
import serviceTime from "@/constants/serviceTime";
import Card from "@/components/Card/Card";
import { CtaProps } from "@/components/Card/Card";

function isLastWednesdayOfMonth(date: Date): boolean {
  const next = new Date(date);
  next.setDate(date.getDate() + 7);
  return next.getMonth() !== date.getMonth();
}

function getPrayerMeetingCta(): CtaProps {
  const now = new Date();
  if (now.getDay() !== 3) return { label: "Learn More" };
  if (isLastWednesdayOfMonth(now)) return { label: "Join in Person" };
  return { label: "Join Online", href: "https://meet.google.com/qfq-byjo-erf" };
}

const ServiceTime: FC = () => {
  const prayerMeetingCta = getPrayerMeetingCta();

  return (
    <section className={styles.container}>
      <h4 className={styles.title}>SERVICE TIMES</h4>
      <p className={styles.subtitle}>
        Gather with us as we worship God, study His Word, and encourage one
        another through Christ-centered fellowship.
      </p>

      <div className={styles.cardContainer}>
        {serviceTime.map((service, index) => {
          const { img, title, subtitle, cta, list } = service;
          const resolvedCta = title === "Prayer Meeting" ? prayerMeetingCta : cta;
          return (
            <Card
              key={index}
              img={img}
              title={title}
              subtitle={subtitle}
              cta={resolvedCta}
              list={list}
            />
          );
        })}
      </div>

      <button className={styles.viewAllButton}>VIEW ALL</button>
    </section>
  );
};

export default ServiceTime;
