import type { ReactNode } from "react";

export function highlightQuery(text: string, query: string): ReactNode[] {
  if (!query) return [text];

  const escaped = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const parts = escaped.split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${parts.join("|")})`, "gi");

  return text.split(regex).map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-200 rounded px-1">{part}</mark>
      : <span key={i}>{part}</span>
  );
}
