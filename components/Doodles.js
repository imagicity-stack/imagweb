import { useId } from "react";

// Hand-drawn style stickers and doodles. Pure SVG, so they cost nothing to
// load and animate on the compositor (transform / opacity only).

const ink = "#111111";

export function Burst({ size = 120, color = "#FAE80C", points = 14, className = "" }) {
  const outer = 50;
  const inner = 36;
  const coords = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    coords.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <polygon points={coords.join(" ")} fill={color} />
    </svg>
  );
}

export function Smiley({ size = 110, color = "#ED2041", className = "" }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill={color} stroke={ink} strokeWidth="4" />
      <ellipse cx="36" cy="40" rx="5" ry="8" fill={ink} />
      <ellipse cx="64" cy="40" rx="5" ry="8" fill={ink} />
      <path d="M27 58 Q50 82 73 58" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function Sparks({ size = 70, color = ink, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className} aria-hidden="true">
      <g stroke={color} strokeWidth="5" strokeLinecap="round">
        <path d="M10 40 L22 30" />
        <path d="M24 16 L30 4" />
        <path d="M38 22 L52 14" />
      </g>
    </svg>
  );
}

export function Crown({ size = 80, color = ink, className = "" }) {
  return (
    <svg viewBox="0 0 80 56" width={size} height={size * 0.7} className={className} aria-hidden="true">
      <path
        d="M8 46 L4 12 L24 28 L40 6 L56 28 L76 12 L72 46 Z"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M10 52 L70 52" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Squiggle({ width = 180, color = ink, className = "" }) {
  return (
    <svg viewBox="0 0 180 24" width={width} height={width / 7.5} className={className} aria-hidden="true">
      <path
        d="M4 14 Q 19 2 34 12 T 64 12 T 94 12 T 124 12 T 154 12 T 176 10"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Scribble({ className = "", color = ink }) {
  return (
    <svg viewBox="0 0 300 22" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        className="ix-draw"
        pathLength="1"
        d="M3 15 C 60 5, 120 4, 180 9 S 270 15, 297 7"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CurlyArrow({ size = 110, color = ink, className = "" }) {
  return (
    <svg viewBox="0 0 120 80" width={size} height={size * 0.66} className={className} aria-hidden="true">
      <path
        className="ix-draw"
        pathLength="1"
        d="M6 60 C 30 70, 46 40, 34 30 C 22 20, 8 40, 30 48 C 56 58, 84 40, 104 22"
        fill="none"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M90 18 L106 20 L102 36" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ size = 40, color = "#FAE80C", className = "" }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true">
      <path d="M20 0 C 22 14, 26 18, 40 20 C 26 22, 22 26, 20 40 C 18 26, 14 22, 0 20 C 14 18, 18 14, 20 0 Z" fill={color} />
    </svg>
  );
}

export function Asterisk({ size = 48, color = "#ED2041", className = "" }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
      <g stroke={color} strokeWidth="6" strokeLinecap="round">
        <path d="M24 4 V44" />
        <path d="M6.7 14 L41.3 34" />
        <path d="M6.7 34 L41.3 14" />
      </g>
    </svg>
  );
}

// Rotating badge with text running around a play triangle.
export function SpinBadge({ text = "Strategy • Creative • Performance • ", size = 150, className = "" }) {
  const pathId = `ix-spin-${useId().replace(/:/g, "")}`;
  return (
    <span className={`ix-spin ${className}`.trim()} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="ix-spin-ring">
        <defs>
          <path id={pathId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill={ink} />
        <text fill="#FFF7E8" fontSize="19" fontWeight="700" letterSpacing="3.2">
          <textPath href={`#${pathId}`}>{text.toUpperCase()}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 10 12" className="ix-spin-core">
        <polygon points="0,0 10,6 0,12" fill="#FAE80C" />
      </svg>
    </span>
  );
}

// Chunky two-tone icons in the spirit of hand-drawn marker sketches.
const iconPaths = {
  bulb: (
    <>
      <path d="M32 8 C 18 8, 12 20, 16 30 C 19 37, 24 40, 24 47 L40 47 C 40 40, 45 37, 48 30 C 52 20, 46 8, 32 8 Z" fill="#FAE80C" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M25 53 H39 M27 59 H37" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M8 18 L2 14 M56 18 L62 14 M32 1 V-3" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  pencil: (
    <>
      <path d="M44 6 L58 20 L22 56 L6 60 L10 44 Z" fill="#ED2041" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M38 12 L52 26" stroke={ink} strokeWidth="3.5" />
      <path d="M10 44 L22 56" stroke={ink} strokeWidth="3.5" />
    </>
  ),
  megaphone: (
    <>
      <path d="M8 26 H18 L44 12 V52 L18 38 H8 Z" fill="#FAE80C" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M18 38 L22 54 H30 L28 41" fill="#fff" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M52 24 L60 20 M52 32 H61 M52 40 L60 44" stroke="#ED2041" strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  bolt: (
    <>
      <path d="M36 2 L10 36 H28 L22 62 L54 24 H34 Z" fill="#ED2041" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
    </>
  ),
  heart: (
    <path d="M32 56 C 6 40, 4 22, 14 14 C 22 8, 30 12, 32 20 C 34 12, 42 8, 50 14 C 60 22, 58 40, 32 56 Z" fill="#ED2041" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
  ),
  star: (
    <path d="M32 4 L39 23 L60 24 L43 37 L49 58 L32 46 L15 58 L21 37 L4 24 L25 23 Z" fill="#FAE80C" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
  ),
  smile: (
    <>
      <circle cx="32" cy="32" r="26" fill="#FAE80C" stroke={ink} strokeWidth="3.5" />
      <circle cx="24" cy="27" r="3.5" fill={ink} />
      <circle cx="40" cy="27" r="3.5" fill={ink} />
      <path d="M21 38 Q32 49 43 38" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  box: (
    <>
      <path d="M8 20 L32 8 L56 20 L56 46 L32 58 L8 46 Z" fill="#ED2041" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M8 20 L32 32 L56 20 M32 32 V58" fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
    </>
  ),
  target: (
    <>
      <circle cx="32" cy="32" r="26" fill="#fff" stroke={ink} strokeWidth="3.5" />
      <circle cx="32" cy="32" r="16" fill="#ED2041" stroke={ink} strokeWidth="3.5" />
      <circle cx="32" cy="32" r="6" fill="#FAE80C" stroke={ink} strokeWidth="3" />
    </>
  ),
  rocket: (
    <>
      <path d="M32 4 C 46 14, 48 32, 42 46 H22 C 16 32, 18 14, 32 4 Z" fill="#fff" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="32" cy="24" r="6" fill="#FAE80C" stroke={ink} strokeWidth="3" />
      <path d="M22 46 L26 58 L32 50 L38 58 L42 46" fill="#ED2041" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
    </>
  )
};

export function Doodle({ name = "star", size = 56, className = "" }) {
  return (
    <svg viewBox="-2 -4 68 68" width={size} height={size} className={`ix-doodle ${className}`.trim()} aria-hidden="true">
      {iconPaths[name] || iconPaths.star}
    </svg>
  );
}
