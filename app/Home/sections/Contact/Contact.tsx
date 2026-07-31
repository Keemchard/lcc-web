import { FC } from "react";
import styles from "./Contact.module.scss";
import { quickLinksRow1, quickLinksRow2 } from "@/constants/quickLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons/faLocation";
import Map from "@/components/Map/Map";
import { contactInfo } from "@/constants/contact";
import Footer from "@/components/Footer/Footer";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const Contact: FC = () => {
  return (
    <div className={styles.container}>
      <section>
        <div className={styles.contactDetails}>
          <div className={styles.quickLinks}>
            <p className={styles.title}>Quick Links</p>
            <div className={styles.quickLinksContainer}>
              <div className={styles.linksContainer}>
                {quickLinksRow1.map((link, index) => {
                  const { name, url } = link;
                  return (
                    <a key={index} href={url} className={styles.link}>
                      {name}
                    </a>
                  );
                })}
              </div>
              <div className={styles.linksContainer}>
                {quickLinksRow2.map((link, index) => {
                  const { name, url } = link;
                  return (
                    <a key={index} href={url} className={styles.link}>
                      {name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={styles.contactInfo}>
            <p className={styles.title}>Contact Information</p>

            <div className={styles.contactInfoContainer}>
              <div>
                {contactInfo.map((contact, index) => {
                  const { label, icon } = contact;
                  return (
                    <div key={index} className={styles.contactItem}>
                      <FontAwesomeIcon
                        icon={icon as IconDefinition}
                        className={styles.contactIcon}
                      />
                      <p className={styles.contactLabel}>{label}</p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.contactItem}>
                <FontAwesomeIcon
                  icon={faLocation}
                  className={styles.contactIcon}
                />
                <p className={styles.contactLabel}>
                  9VR6+VQM, Bukal Rd, Tanza, 4108 Cavite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Map />

      <Footer />
    </div>
  );
};

export default Contact;
