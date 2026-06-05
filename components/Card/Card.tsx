import { FC } from "react";
import styles from "./Card.module.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type IconWithLabel = {
  icon?: IconDefinition;
  label: string;
};

export type CardProps = {
  img: string;
  title: string;
  subtitle?: string;
  list?: IconWithLabel[];
  cta?: IconWithLabel;
};

const Card: FC<CardProps> = (props) => {
  const { img, title, list, cta, subtitle } = props;
  return (
    <div className={styles.container}>
      <Image
        className={styles.img}
        src={img}
        alt={img}
        width={500}
        height={300}
      />
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div>
          {list &&
            list.length > 0 &&
            list.map((item, index) => {
              const { icon, label } = item;
              return (
                <div key={index} className={styles.listItem}>
                  {icon && (
                    <FontAwesomeIcon icon={icon} className={styles.listIcon} />
                  )}
                  <p className={styles.listLabel}>{label}</p>
                </div>
              );
            })}

          {cta && (
            <button className={styles.ctaButton}>
              {cta.icon && <FontAwesomeIcon icon={cta.icon} />}
              {cta.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
