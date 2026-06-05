import { FC } from "react";
import styles from "./Service.module.scss";
import serviceTime from "@/constants/serviceTime";
import Card from "@/components/Card/Card";

const ServiceTime: FC = () => {
  return (
    <section className={styles.container}>
      <h4 className={styles.title}>SERVICE TIMES</h4>
      <p className={styles.subtitle}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet,
        eligendi! Lorem ipsum dolor sit amet.
      </p>

      <div className={styles.cardContainer}>
        {serviceTime.map((service, index) => {
          const { img, title, subtitle, cta } = service;
          return (
            <Card
              key={index}
              img={img}
              title={title}
              subtitle={subtitle}
              cta={cta}
            />
          );
        })}
      </div>

      <button className={styles.viewAllButton}>VIEW ALL</button>
    </section>
  );
};

export default ServiceTime;
