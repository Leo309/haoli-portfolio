"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  // Determine the primary link (live > github)
  const primaryLink = project.liveUrl || project.githubUrl;

  const CardWrapper = primaryLink ? "a" : "div";
  const linkProps = primaryLink
    ? {
        href: primaryLink,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <CardWrapper
        {...linkProps}
        className="group relative block rounded-lg p-5 transition-all duration-300 hover:bg-slate-800/50 hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] hover:drop-shadow-lg lg:p-6"
      >
        {/* Hover border glow */}
        <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-lg border border-transparent transition-colors group-hover:border-slate-700/50 lg:block" />

        <div className="relative z-10">
          {/* Title with arrow */}
          <h3 className="flex items-center gap-1 text-lg font-medium leading-snug text-slate-200 group-hover:text-teal-300 transition-colors">
            {project.title}
            <ArrowUpRight
              size={16}
              className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm leading-normal text-slate-400">
            {project.description}
          </p>

          {/* Tech stack tags */}
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300"
              >
                {tech}
              </li>
            ))}
          </ul>

          {/* Secondary links */}
          {project.liveUrl && project.githubUrl && (
            <div className="mt-3 flex gap-4 text-xs text-slate-500">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
            </div>
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
}
