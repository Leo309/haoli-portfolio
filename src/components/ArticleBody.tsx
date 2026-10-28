import ReactMarkdown from "react-markdown";

// Tailwind Typography restyled to the site tokens, shared by case and lab pages
const PROSE = [
  "prose max-w-none",
  "prose-headings:text-ink prose-headings:tracking-[-0.02em]",
  "prose-h2:mt-9 prose-h2:mb-3 prose-h2:text-lg",
  "prose-p:text-ink-2 prose-li:text-ink-2 prose-li:marker:text-muted",
  "prose-strong:text-ink prose-a:text-accent prose-a:underline-offset-2",
  "prose-code:text-ink prose-code:before:content-none prose-code:after:content-none",
].join(" ");

export default function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className={PROSE}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
