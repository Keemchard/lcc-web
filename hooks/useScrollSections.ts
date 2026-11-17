"use client";

import { useCallback, useEffect, useState } from "react";

type UseScrollSectionsProps = {
  sectionIds: string[];
};

export const useScrollSections = ({ sectionIds }: UseScrollSectionsProps) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 120;
      let current = sectionIds[0] ?? "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= offset) {
          current = id;
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return { activeSection, scrollToSection };
};
