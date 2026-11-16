"use client";

import { FC } from "react";
import styles from "./Service.module.scss";
import Card from "@/components/Card/Card";
import { CardProps, CtaProps } from "@/components/Card/Card";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import type { SerializedServiceTime } from "@/types";

function isLastWednesdayOfMonth(date: Date): boolean {
  const next = new Date(date);
  next.setDate(date.getDate() + 7);
  return next.getMonth() !== date.getMonth();
}

function getPrayerMeetingCta(): CtaProps {
  const now = new Date();
  if (now.getDay() !== 3) return { label: "Learn More" };
  if (isLastWednesdayOfMonth(now)) return { label: "Join in Person" };
  return {
    label: "Join Online",
    href: "https://meet.google.com/qfq-byjo-erf",
  };
}

type Props = {
  firestoreData?: SerializedServiceTime[];
  fallbackData?: CardProps[];
};

const ServiceTimeCards: FC<Props> = ({ firestoreData, fallbackData }) => {
  const prayerMeetingCta = getPrayerMeetingCta();

  if (fallbackData) {
    return (
      <div className={styles.cardContainer}>
        {fallbackData.map((service, index) => {
          const resolvedCta =
            service.title === "Prayer Meeting" ? prayerMeetingCta : service.cta;
          return (
            <Card
              key={index}
              img={service.img}
              title={service.title}
              subtitle={service.subtitle}
              cta={resolvedCta}
              list={service.list}
            />
          );
        })}
      </div>
    );
  }

  if (!firestoreData) return null;

  return (
    <div className={styles.cardContainer}>
      {firestoreData.map((service) => {
        const resolvedCta =
          service.title === "Prayer Meeting"
            ? prayerMeetingCta
            : { label: service.ctaLabel, href: service.ctaHref };
        return (
          <Card
            key={service.id}
            img={service.imageUrl}
            title={service.title}
            cta={resolvedCta}
            list={[
              { icon: faClock, label: service.time },
              { icon: faLocationDot, label: service.location },
              { icon: faMicrophone, label: service.speaker },
            ]}
          />
        );
      })}
    </div>
  );
};

export default ServiceTimeCards;
