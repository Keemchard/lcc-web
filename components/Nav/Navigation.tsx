"use client";

import { FC } from "react";
import Image from "next/image";

import styles from "./Navigation.module.scss";

import { navigationItems } from "@/constants/navigation";

import { useScrollSections } from "@/hooks/useScrollSections";

const Navigation: FC = () => {
  const { activeSection, scrollToSection } = useScrollSections({
    sectionIds: navigationItems.map((item) => item.id),
  });

  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Image
          src="/images/lcc-logo.png"
          alt="Livingwater Community Church"
          width={165}
          height={50}
          priority
        />
      </div>

      <div className={styles.links}>
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`${styles.link} ${
              activeSection === item.id ? styles.activeLink : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
