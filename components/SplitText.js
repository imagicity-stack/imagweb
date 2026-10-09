import { Fragment } from "react";

// Splits a heading into masked words that slide up one after another once the
// closest `.reveal` ancestor gets its `.in` class (or the hero starts). Screen
// readers get the plain sentence from the visually hidden copy.
export default function SplitText({ text, className = "", start = 0, step = 55 }) {
  const words = String(text).split(" ");
  return (
    <span className={`ix-splittext ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="ix-w">
              <span className="ix-wi" style={{ "--wd": `${start + index * step}ms` }}>
                {word}
              </span>
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
