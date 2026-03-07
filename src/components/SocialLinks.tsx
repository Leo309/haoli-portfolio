import { Github, Linkedin, Mail } from "lucide-react";
import { personalInfo } from "@/lib/data";

const links = [
  {
    href: personalInfo.github,
    icon: Github,
    label: "GitHub",
  },
  {
    href: personalInfo.linkedin,
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
    label: "Email",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-5">
      {links.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          className="text-slate-500 transition-colors hover:text-slate-200"
        >
          <Icon size={22} />
        </a>
      ))}
    </div>
  );
}
