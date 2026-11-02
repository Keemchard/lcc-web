"use client";

import { FC, useState } from "react";
import Image from "next/image";
import styles from "./Navigation.module.scss";
import { navigationItems } from "@/constants/navigation";
import { useScrollSections } from "@/hooks/useScrollSections";

const Navigation: FC = () => {
  const { activeSection, scrollToSection } = useScrollSections({
    sectionIds: navigationItems.map((item) => item.id),
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

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

      <button
        className={styles.hamburger}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen1 : ""}`} />
        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen2 : ""}`} />
        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen3 : ""}`} />
      </button>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`${styles.mobileLink} ${
                activeSection === item.id ? styles.activeMobileLink : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
