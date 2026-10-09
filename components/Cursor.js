import { useEffect, useRef } from "react";

const CLICKABLE = "a, button, summary, label, [role='button'], input[type='submit']";

// A halo that eases after the native cursor (which stays visible, so pointing
// never feels laggy). It swells over anything clickable and turns into a
// "View" bubble over work cards. Mouse/trackpad devices only; the loop parks
// itself once the halo catches up so an idle page burns no frames.
export default function Cursor() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return undefined;

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let frame = 0;
    let mode = "";

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      root.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };

    const setMode = (next) => {
      if (next === mode) return;
      if (mode) root.classList.remove(`is-${mode}`);
      if (next) root.classList.add(`is-${next}`);
      mode = next;
    };

    const onMove = (event) => {
      tx = event.clientX;
      ty = event.clientY;
      if (!root.classList.contains("is-live")) {
        x = tx;
        y = ty;
        root.classList.add("is-live");
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const tagged = target.closest("[data-cursor]");
      if (tagged) setMode(tagged.getAttribute("data-cursor"));
      else if (target.closest(CLICKABLE)) setMode("link");
      else setMode("");
    };

    const onLeave = () => root.classList.remove("is-live");
    const onDown = () => root.classList.add("is-down");
    const onUp = () => root.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ix-cursor" ref={rootRef} aria-hidden="true">
      <span className="ix-cursor-ring" />
      <span className="ix-cursor-label">
        View <b>→</b>
      </span>
    </div>
  );
}
