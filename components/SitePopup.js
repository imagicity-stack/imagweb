import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { pathToPageKey } from "../lib/popups";
import PopupCard from "./PopupCard";

const DAY_MS = 24 * 60 * 60 * 1000;
const storeKey = (id) => `imag_popup_${id}`;

function isDismissed(popup) {
  if (popup.frequency === "always") return false;
  try {
    if (popup.frequency === "session") {
      return sessionStorage.getItem(storeKey(popup.id)) === "1";
    }
    const ts = Number(localStorage.getItem(storeKey(popup.id)));
    return ts ? Date.now() - ts < DAY_MS : false;
  } catch (error) {
    return false;
  }
}

function markSeen(popup) {
  try {
    if (popup.frequency === "session") {
      sessionStorage.setItem(storeKey(popup.id), "1");
    } else if (popup.frequency === "daily") {
      localStorage.setItem(storeKey(popup.id), String(Date.now()));
    }
  } catch (error) {
    /* storage unavailable — ignore */
  }
}

// Renders the first eligible active popup for the current page, honouring its
// trigger and frequency settings. Mounted once in the site Layout.
export default function SitePopup() {
  const router = useRouter();
  const [popups, setPopups] = useState(null);
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/popups")
      .then((res) => res.json())
      .then((data) => {
        if (alive && data.ok) setPopups(data.popups || []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!popups || !popups.length || visible) return undefined;
    const pageKey = pathToPageKey(router.pathname);
    const candidate = popups.find(
      (p) =>
        (p.pages.includes("all") || p.pages.includes(pageKey)) && !isDismissed(p)
    );
    if (!candidate) return undefined;

    const reveal = () => {
      setActive(candidate);
      setVisible(true);
    };

    const trigger = candidate.trigger || { type: "delay", delaySeconds: 5 };
    let timer;
    let onLeave;

    if (trigger.type === "immediate") {
      timer = setTimeout(reveal, 400);
    } else if (trigger.type === "exit") {
      onLeave = (event) => {
        if (event.clientY <= 0) reveal();
      };
      document.addEventListener("mouseleave", onLeave);
      timer = setTimeout(reveal, 30000); // fallback for touch / no exit
    } else {
      timer = setTimeout(reveal, Math.max(0, trigger.delaySeconds || 5) * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (onLeave) document.removeEventListener("mouseleave", onLeave);
    };
  }, [popups, router.pathname, visible]);

  const close = useCallback(() => {
    if (active) markSeen(active);
    setVisible(false);
  }, [active]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [visible, close]);

  if (!active || !visible) return null;

  return (
    <div
      className="site-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={active.heading || "Announcement"}
      onClick={close}
    >
      <PopupCard popup={active} onClose={close} onCta={() => markSeen(active)} />
    </div>
  );
}
