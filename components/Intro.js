import { useEffect, useState } from "react";

const WORD = "Imagicity".split("");

// How long the CSS timeline in site.css takes before the overlay is invisible.
const INTRO_MS = 3300;
const UNLOCK_MS = 2300;

// First-visit opener: the two brand triangles slam together, the wordmark
// types itself in, a counter races to 100 and three coloured curtains lift to
// reveal the page. The whole sequence is CSS keyframes that start on first
// paint (before React hydrates), so it plays smoothly even on slow phones.
// An inline script in _document marks <html> with `no-intro` for repeat visits
// in the same tab, reduced-motion users and the admin, which hides it at once.
export default function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("no-intro")) {
      setGone(true);
      return undefined;
    }

    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    const unlock = window.setTimeout(() => {
      body.style.overflow = previous;
    }, UNLOCK_MS);

    const finish = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("ix-intro", "1");
      } catch (error) {
        // Storage can be blocked; the intro will simply play again next load.
      }
      root.classList.remove("intro-on");
      root.classList.add("no-intro");
      setGone(true);
    }, INTRO_MS);

    return () => {
      window.clearTimeout(unlock);
      window.clearTimeout(finish);
      body.style.overflow = previous;
    };
  }, []);

  if (gone) return null;

  return (
    <div className="ix-intro" aria-hidden="true">
      <span className="ix-intro-layer is-y" />
      <span className="ix-intro-layer is-r" />
      <div className="ix-intro-layer is-k">
        <div className="ix-intro-ghost">
          <span>LOUD • BOLD • BRAVE • IMAGICITY • LOUD • BOLD • BRAVE • IMAGICITY •</span>
        </div>

        <div className="ix-intro-stage">
          <span className="ix-intro-markwrap">
            <svg viewBox="0 0 1388 1388" className="ix-intro-mark">
              <polygon className="is-y" points="0,0 912,694 0,1388" fill="#FAE80C" />
              <polygon className="is-r" points="1388,0 477,694 1388,1388" fill="#ED2041" />
            </svg>
          </span>
          <div className="ix-intro-word">
            {WORD.map((letter, index) => (
              <span className="ix-intro-mask" key={`${letter}-${index}`}>
                <span style={{ "--li": index }}>{letter}</span>
              </span>
            ))}
            <svg viewBox="0 0 10 12" className="ix-intro-play">
              <polygon points="0,0 10,6 0,12" fill="#ED2041" />
            </svg>
          </div>
        </div>

        <span className="ix-intro-tag">brands that refuse to blend in</span>
        <span className="ix-intro-count" />
        <span className="ix-intro-bar" />
      </div>
    </div>
  );
}
