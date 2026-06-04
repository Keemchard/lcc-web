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

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);

        if (visibleSection?.target.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return {
    activeSection,
    scrollToSection,
  };
};
