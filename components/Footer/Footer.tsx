import { FC } from "react";
import styles from "./Footer.module.scss";
import { socMedAccounts } from "@/constants/contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const Footer: FC = () => {
  return (
    <div className={styles.container}>
      <section>
        <div className={styles.socMedContainer}>
          {socMedAccounts.map((socMed, index) => {
            const { url, icon } = socMed;
            return (
              <a key={index} href={url} className={styles.socMedLink}>
                <FontAwesomeIcon
                  icon={icon as IconDefinition}
                  className={styles.contactIcon}
                />
              </a>
            );
          })}
        </div>

        <p>@2026 LIVINGWATER COMMUNITY CHURCH | ALL RIGHTS RESERVE</p>
      </section>
    </div>
  );
};

export default Footer;
