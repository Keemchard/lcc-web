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
        const visibleSections = entries.filter((entry) => entry.isIntersecting);

        if (visibleSections.length === 0) return;

        const mostVisibleSection = visibleSections.reduce((current, next) => {
          return next.intersectionRatio > current.intersectionRatio
            ? next
            : current;
        });

        if (mostVisibleSection.target.id) {
          setActiveSection((current) =>
            current === mostVisibleSection.target.id
              ? current
              : mostVisibleSection.target.id,
          );
        }
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
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
