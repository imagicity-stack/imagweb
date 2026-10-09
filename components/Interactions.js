import { useEffect } from "react";

// Site-wide pointer niceties wired through one delegated listener:
//  - [data-magnetic]  buttons lean toward the cursor (CSS `translate`)
//  - [data-tilt]      cards tilt in 3D toward the cursor (--rx / --ry)
// Everything is batched into a single rAF and skipped on touch devices.
export default function Interactions() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return undefined;

    let magnet = null;
    let tilt = null;
    let event = null;
    let frame = 0;

    const release = (el, kind) => {
      if (!el) return;
      if (kind === "magnet") el.style.translate = "";
      else {
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
        el.style.removeProperty("--gx");
        el.style.removeProperty("--gy");
        el.classList.remove("is-tilting");
      }
    };

    const apply = () => {
      frame = 0;
      if (!event) return;
      const target = event.target instanceof Element ? event.target : null;
      const nextMagnet = target?.closest("[data-magnetic]") || null;
      const nextTilt = target?.closest("[data-tilt]") || null;

      if (nextMagnet !== magnet) {
        release(magnet, "magnet");
        magnet = nextMagnet;
      }
      if (nextTilt !== tilt) {
        release(tilt, "tilt");
        tilt = nextTilt;
      }

      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        magnet.style.translate = `${(dx * 0.28).toFixed(1)}px ${(dy * 0.38).toFixed(1)}px`;
      }

      if (tilt) {
        const rect = tilt.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        tilt.classList.add("is-tilting");
        tilt.style.setProperty("--ry", `${((px - 0.5) * 10).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${((0.5 - py) * 10).toFixed(2)}deg`);
        tilt.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      }
    };

    const onMove = (e) => {
      event = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeaveWindow = () => {
      release(magnet, "magnet");
      release(tilt, "tilt");
      magnet = null;
      tilt = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
