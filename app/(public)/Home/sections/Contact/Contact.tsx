"use client";

import { FC } from "react";
import styles from "./Contact.module.scss";
import { quickLinksRow1 } from "@/constants/quickLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons/faLocation";
import { contactInfo } from "@/constants/contact";
import Footer from "@/components/Footer/Footer";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const Contact: FC = () => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <span className={styles.eyebrow}>Contact us</span>
        <h3 className={styles.sectionTitle}>Get in touch</h3>

        <div className={styles.contactGrid}>
          <div className={styles.quickLinks}>
            <p className={styles.columnTitle}>Quick links</p>
            <div className={styles.linksColumn}>
              {quickLinksRow1.map((link, index) => {
                const { name, url } = link;
                return (
                  <a key={index} href={url} className={styles.link}>
                    {name}
                  </a>
                );
              })}
            </div>
          </div>

          <div className={styles.contactInfo}>
            <p className={styles.columnTitle}>Contact information</p>
            <div className={styles.contactItems}>
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

      <div className={styles.mapWrapper}>
        <Map />
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
