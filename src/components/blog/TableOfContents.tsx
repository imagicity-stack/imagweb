import Link from "next/link";

interface Props {
  content: string;
}

const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const TableOfContents = ({ content }: Props) => {
  const headings = content
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => {
      const depth = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, "").trim();
      return { depth, text, id: slugifyHeading(text) };
    })
    .slice(0, 20);

  if (!headings.length) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow">
      <h3 className="text-lg font-semibold text-white mb-2">Table of contents</h3>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <Link
            key={heading.id}
            href={`#${heading.id}`}
            className="block text-sm text-slate-200 hover:text-cyan-300"
            style={{ paddingLeft: (heading.depth - 1) * 12 }}
          >
            {heading.text}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
