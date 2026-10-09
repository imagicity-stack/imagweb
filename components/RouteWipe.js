import { useEffect, useRef } from "react";
import Router from "next/router";
import { Mark } from "./Logo";

const COVER_MS = 520;
const REVEAL_MS = 760;

const skipPath = (pathname) =>
  /^\/(admin|api)(\/|$)/.test(pathname) ||
  pathname.startsWith("/creacity/admin") ||
  /\.[a-z0-9]+$/i.test(pathname);

// Page transition: internal link clicks are held for half a second while three
// brand-coloured panels sweep up over the screen, the route changes underneath,
// then the panels carry on upward to reveal the new page. Modified clicks, new
// tabs, hash jumps, external links and reduced-motion users are left alone.
export default function RouteWipe() {
  const wipeRef = useRef(null);
  const state = useRef({ covering: false, startedAt: 0, timers: [] });

  useEffect(() => {
    const wipe = wipeRef.current;
    if (!wipe) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const s = state.current;

    const later = (fn, ms) => s.timers.push(window.setTimeout(fn, ms));

    const reveal = () => {
      if (!s.covering) return;
      const wait = Math.max(0, COVER_MS - (performance.now() - s.startedAt));
      later(() => {
        wipe.classList.remove("is-cover");
        wipe.classList.add("is-reveal");
        later(() => {
          wipe.classList.remove("is-reveal");
          document.documentElement.classList.remove("ix-wiping");
          s.covering = false;
        }, REVEAL_MS);
      }, wait);
    };

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download") || anchor.hasAttribute("data-no-wipe")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || skipPath(url.pathname)) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (reduce.matches || s.covering) return;

      event.preventDefault();
      s.covering = true;
      s.startedAt = performance.now();
      wipe.classList.remove("is-reveal");
      // Lets the next page's hero hold its entrance until the panels lift.
      document.documentElement.classList.add("ix-wiping");
      // Force a reflow so the cover animation restarts cleanly every time.
      void wipe.offsetWidth;
      wipe.classList.add("is-cover");
      later(() => {
        Router.push(url.pathname + url.search + url.hash)
          .then((navigated) => {
            if (!navigated) reveal();
          })
          .catch(() => reveal());
      }, COVER_MS - 40);
    };

    document.addEventListener("click", onClick, true);
    Router.events.on("routeChangeComplete", reveal);
    Router.events.on("routeChangeError", reveal);

    return () => {
      document.removeEventListener("click", onClick, true);
      Router.events.off("routeChangeComplete", reveal);
      Router.events.off("routeChangeError", reveal);
      s.timers.forEach((id) => window.clearTimeout(id));
      s.timers = [];
    };
  }, []);

  return (
    <div className="ix-wipe" ref={wipeRef} aria-hidden="true">
      <span className="ix-wipe-p is-y" />
      <span className="ix-wipe-p is-r" />
      <span className="ix-wipe-p is-k">
        <Mark size={84} className="ix-wipe-mark" />
      </span>
    </div>
  );
}
