"use client";

import { personalInfo, sections } from "@/lib/data";
import { useActiveSection } from "@/hooks/useActiveSection";
import NavLink from "./NavLink";
import SocialLinks from "./SocialLinks";

export default function LeftSidebar() {
  const activeSection = useActiveSection();

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        {/* Name & title */}
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          <a href="/">{personalInfo.name}</a>
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          {personalInfo.title}
        </h2>
        <p className="mt-4 max-w-xs leading-normal text-slate-400">
          {personalInfo.tagline}
        </p>

        {/* Navigation - desktop only */}
        <nav className="mt-16 hidden lg:block" aria-label="In-page navigation">
          <ul className="flex flex-col gap-1">
            {sections.map((sectionId) => (
              <li key={sectionId}>
                <NavLink
                  sectionId={sectionId}
                  isActive={activeSection === sectionId}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Social links */}
      <div className="mt-8 lg:mt-0">
        <SocialLinks />
      </div>
    </header>
  );
}
