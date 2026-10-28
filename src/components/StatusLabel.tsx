import { STATUS_LABEL, type Status } from "@/lib/site";

const DOT_COLOR: Record<Status, string> = {
  live: "bg-live",
  paused: "bg-paused",
  experiment: "bg-experiment",
};

// Dot + text: the word carries the meaning, the dot is decoration (color-blind safe)
export default function StatusLabel({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-muted">
      <span aria-hidden className={`size-1.5 rounded-full ${DOT_COLOR[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
