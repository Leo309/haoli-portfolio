import Image from "next/image";
import Link from "next/link";
import { profile } from "@/lib/site";

// Slim header for article pages, which don't carry the sticky sidebar
export default function TopBar() {
  return (
    <header className="mx-auto flex max-w-[680px] items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/" className="flex min-h-10 items-center gap-2.5">
        <Image src="/avatar.png" alt="" width={32} height={32} className="size-8 rounded-full bg-accent-avatar object-cover" />
        <span className="text-[15px] font-bold">{profile.name}</span>
      </Link>
      <button
        type="button"
        data-panel="inquiry"
        className="inline-flex min-h-10 items-center gap-1.5 rounded-[10px] bg-accent px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-ink"
      >
        Work with me <span aria-hidden>→</span>
      </button>
    </header>
  );
}
