"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Navigation.module.scss";
import { navigationItems } from "@/constants/navigation";
import { useScrollSections } from "@/hooks/useScrollSections";

const Navigation: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const { activeSection, scrollToSection } = useScrollSections({
    sectionIds: navigationItems.filter((i) => !i.href).map((i) => i.id),
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (item: (typeof navigationItems)[number]) => {
    setIsMenuOpen(false);

    if (item.href) {
      router.push(item.href);
    } else if (isHome) {
      scrollToSection(item.id);
    } else {
      router.push(`/#${item.id}`);
    }
  };

  const isActive = (item: (typeof navigationItems)[number]) => {
    if (item.href) return pathname === item.href;
    return isHome && activeSection === item.id;
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
            onClick={() => handleNavClick(item)}
            className={`${styles.link} ${isActive(item) ? styles.activeLink : ""}`}
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
              onClick={() => handleNavClick(item)}
              className={`${styles.mobileLink} ${isActive(item) ? styles.activeMobileLink : ""}`}
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
