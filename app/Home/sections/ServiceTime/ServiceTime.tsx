import { FC } from "react";
import styles from "./Service.module.scss";
import serviceTime from "@/constants/serviceTime";
import Card from "@/components/Card/Card";

const ServiceTime: FC = () => {
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
          return (
            <div key={index}>
              <Card
                img={img}
                title={title}
                subtitle={subtitle}
                cta={cta}
                list={list}
              />
            </div>
          );
        })}
      </div>

      <button className={styles.viewAllButton}>VIEW ALL</button>
    </section>
  );
};

export default ServiceTime;
