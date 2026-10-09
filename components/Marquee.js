import { Mark } from "./Logo";

// Infinite ticker tape. The track is rendered twice and slid by -50% with a
// CSS animation, so it never janks and costs no JavaScript per frame.
export default function Marquee({
  items,
  tone = "yellow",
  reverse = false,
  duration = 38,
  tilt = 0,
  className = ""
}) {
  const row = (copy) => (
    <div className="ix-marquee-row" aria-hidden={copy ? "true" : undefined}>
      {items.map((item, index) => (
        <span className="ix-marquee-item" key={`${copy}-${item}-${index}`}>
          {item}
          <Mark size={22} className="ix-marquee-sep" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`ix-marquee ix-marquee-${tone} ${reverse ? "is-reverse" : ""} ${className}`.trim()}
      style={{ "--dur": `${duration}s`, "--tilt": `${tilt}deg` }}
    >
      <div className="ix-marquee-track">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
