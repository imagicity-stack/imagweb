import { photo } from "../lib/media";

// Responsive Unsplash image. `ratio` is height / width, so the browser can
// reserve space before the file arrives (no layout shift), and the srcset
// lets the CDN hand phones a lighter file than desktops.
export default function Img({
  id,
  alt = "",
  width = 900,
  ratio = 0.75,
  sizes = "(max-width: 760px) 100vw, 50vw",
  priority = false,
  className = "",
  ...rest
}) {
  const steps = [0.5, 1, 1.6].map((f) => Math.round(width * f));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo(id, width, ratio)}
      srcSet={steps.map((w) => `${photo(id, w, ratio)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={width}
      height={Math.round(width * ratio)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : undefined}
      className={`ix-img ${className}`.trim()}
      {...rest}
    />
  );
}
