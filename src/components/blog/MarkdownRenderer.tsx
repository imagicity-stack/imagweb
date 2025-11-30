import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const MarkdownRenderer = ({ content }: Props) => {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none prose-img:rounded-xl prose-headings:text-white prose-p:text-slate-200"
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children, ...props }) => {
          const text = String(children);
          const id = slugifyHeading(text);
          return (
            <h1 id={id} {...props}>
              {children}
            </h1>
          );
        },
        h2: ({ children, ...props }) => {
          const text = String(children);
          const id = slugifyHeading(text);
          return (
            <h2 id={id} {...props}>
              {children}
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const text = String(children);
          const id = slugifyHeading(text);
          return (
            <h3 id={id} {...props}>
              {children}
            </h3>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
