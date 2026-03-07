"use client";

import { SectionId } from "@/lib/data";

interface NavLinkProps {
  sectionId: SectionId;
  isActive: boolean;
}

export default function NavLink({ sectionId, isActive }: NavLinkProps) {
  const label = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

  return (
    <a
      href={`#${sectionId}`}
      className="group flex items-center gap-4 py-2"
    >
      {/* Indicator line */}
      <span
        className={`block h-px transition-all duration-300 ${
          isActive
            ? "w-16 bg-slate-200"
            : "w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200"
        }`}
      />
      {/* Label */}
      <span
        className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
          isActive
            ? "text-slate-200"
            : "text-slate-500 group-hover:text-slate-200"
        }`}
      >
        {label}
      </span>
    </a>
  );
}
