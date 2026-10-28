import { links, products } from "@/lib/site";
import { ArrowCircle } from "@/components/Icons";
import StatusLabel from "@/components/StatusLabel";
import SectionHeader from "./SectionHeader";

export default function Products() {
  return (
    <section aria-labelledby="products">
      <SectionHeader
        id="products"
        title="Products"
        count={products.length}
        link={{ href: links.skynex, label: "by Skynex Digital ↗", external: true }}
      />
      <div className="grid gap-2.5">
        {products.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgb(38_37_31/0.2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-[11px] text-[15px] font-extrabold"
              style={{ backgroundColor: p.tile.bg, color: p.tile.fg }}
            >
              {p.tile.letter}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 font-semibold">
                {p.name} <StatusLabel status={p.status} />
              </span>
              <span className="mt-0.5 block text-[13px] text-ink-2">{p.description}</span>
              <span className="mt-1 block truncate font-mono text-[11px] text-muted">{p.displayUrl}</span>
            </span>
            <ArrowCircle />
          </a>
        ))}
      </div>
    </section>
  );
}
