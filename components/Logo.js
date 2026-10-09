// Imagicity brand mark, redrawn as SVG from the master artwork so it stays
// crisp at any size and can be animated piece by piece.
export function Mark({ size = 40, className = "", title }) {
  return (
    <svg
      viewBox="0 0 1388 1388"
      width={size}
      height={size}
      className={`ix-mark ${className}`.trim()}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
    >
      {title ? <title>{title}</title> : null}
      <polygon className="ix-mark-y" points="0,0 912,694 0,1388" fill="#FAE80C" />
      <polygon className="ix-mark-r" points="1388,0 477,694 1388,1388" fill="#ED2041" />
    </svg>
  );
}

// Small "play" triangle that trails the wordmark.
export function Play({ size = 12, className = "" }) {
  return (
    <svg
      viewBox="0 0 10 12"
      width={size}
      height={size * 1.2}
      className={`ix-play ${className}`.trim()}
      aria-hidden="true"
    >
      <polygon points="0,0 10,6 0,12" fill="#ED2041" />
    </svg>
  );
}

export default function Logo({ size = 34, className = "" }) {
  return (
    <span className={`ix-logo ${className}`.trim()}>
      <Mark size={size} />
      <span className="ix-logo-word">
        Imagicity
        <Play size={size * 0.24} />
      </span>
    </span>
  );
}
