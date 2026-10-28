import Image from "next/image";
import { OpenPanelButton } from "./PanelProvider";
import { links, profile } from "@/lib/site";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

const SOCIALS = [
  { label: "LinkedIn", href: links.linkedin, Icon: LinkedInIcon, external: true },
  { label: "GitHub", href: links.github, Icon: GitHubIcon, external: true },
  { label: "Email", href: `mailto:${links.email}`, Icon: MailIcon, external: false },
];

// Identity + actions. Sticky beside the content on desktop; a normal top block on phones.
export default function Sidebar() {
  return (
    <aside className="pt-10 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[31%] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:py-20">
      <div className="flex items-center gap-3">
        <Image
          src="/avatar.png"
          alt="Hao Li"
          width={56}
          height={56}
          priority
          className="size-14 rounded-full bg-accent-avatar object-cover shadow-[0_0_0_3px_#fff,0_2px_10px_rgb(38_37_31/0.1)]"
        />
        <div>
          <p className="text-[15px] font-bold">{profile.name}</p>
          <p className="text-[12.5px] text-muted">{profile.location}</p>
        </div>
      </div>

      <h1 className="mt-7 text-[34px] leading-[1.04] font-extrabold tracking-[-0.035em] sm:text-[38px]">
        {profile.headline}
      </h1>
      <p className="mt-3 text-[15px] leading-normal text-ink-2">{profile.subline}</p>

      <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-card py-1.5 pr-3 pl-2.5 text-[12.5px] text-ink-2">
        <span aria-hidden className="pulse-dot size-2 rounded-full bg-live" />
        {profile.availability}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <OpenPanelButton
          panel="inquiry"
          className="group inline-flex min-h-10 items-center gap-1.5 rounded-[10px] bg-accent px-4 text-[13.5px] font-semibold text-white shadow-[0_4px_14px_rgb(47_125_91/0.28)] transition hover:-translate-y-px hover:bg-accent-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Work with me <span aria-hidden className="transition-transform group-hover:translate-x-[3px]">→</span>
        </OpenPanelButton>
        <a
          href={links.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center rounded-[10px] border border-line-2 bg-card px-4 text-[13.5px] font-semibold transition-colors hover:border-ink-2"
        >
          Resume
        </a>
      </div>

      <button
        type="button"
        data-panel="ask"
        className="mt-[18px] flex min-h-11 w-full items-center gap-2.5 rounded-xl border border-line-2 bg-card px-3 text-left text-[13px] text-muted transition hover:border-accent hover:shadow-[0_0_0_4px_var(--color-accent-soft)]"
      >
        <span aria-hidden className="text-accent">✦</span>
        Ask my AI anything about me
        <span aria-hidden className="ml-auto rounded-[5px] border border-line px-1.5 font-mono text-[11px]">↵</span>
      </button>

      <ul className="mt-5 flex gap-1.5">
        {SOCIALS.map(({ label, href, Icon, external }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex size-10 items-center justify-center rounded-[9px] border border-transparent text-muted transition hover:border-line hover:bg-card hover:text-accent"
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
