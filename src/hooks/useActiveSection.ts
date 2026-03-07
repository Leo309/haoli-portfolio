"use client";

import { useEffect, useState } from "react";
import { SectionId, sections } from "@/lib/data";

export function useActiveSection(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>("about");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        {
          // Trigger when section is ~40% visible
          rootMargin: "-40% 0px -60% 0px",
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return activeSection;
}
