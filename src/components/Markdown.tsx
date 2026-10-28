import ReactMarkdown, { type Components } from "react-markdown";

// External links open in a new tab, so a visitor never loses an AskHao conversation
// or the page they were reading. Internal links (starting with "/") stay in place.
const components: Components = {
  a: ({ href = "", children }) =>
    /^https?:\/\//.test(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    ),
};

export default function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
