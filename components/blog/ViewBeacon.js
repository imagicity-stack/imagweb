import { useEffect } from "react";

// Fires a single view ping per post, per browser, per day (localStorage guard
// limits refresh inflation). Renders nothing.
export default function ViewBeacon({ postId, slug, api = "/api/views" }) {
  useEffect(() => {
    if (!postId) return;
    const key = `iv_${postId}`;
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(key) === today) return;
      localStorage.setItem(key, today);
    } catch (error) {
      // Private mode / storage disabled — still count the view.
    }
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, slug }),
      keepalive: true
    }).catch(() => {});
  }, [postId, slug, api]);

  return null;
}
