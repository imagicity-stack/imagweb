// Public newsletter signup. Stores the subscriber and sends a branded
// thank-you email. Honeypot + light rate limiting guard against bots.

import { subscribeEmail } from "../../../lib/newsletterServer";
import { sendNewsletterWelcome } from "../../../lib/mailer";
import { getRequestIp } from "../../../lib/geo";

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const body = req.body || {};
    // Honeypot — bots fill hidden fields; humans never do.
    if (body.website) return res.status(200).json({ ok: true });

    if (rateLimited(getRequestIp(req))) {
      return res.status(429).json({ ok: false, error: "Please try again in a moment." });
    }

    const result = await subscribeEmail({ name: body.name, email: body.email });

    // Send the welcome email only to brand-new subscribers; never block on it.
    if (result.created) {
      try {
        await sendNewsletterWelcome({ name: result.name, email: result.email });
      } catch (mailError) {
        console.error("[newsletter] welcome email failed:", mailError.message);
      }
    }

    return res.status(200).json({
      ok: true,
      message: result.alreadySubscribed
        ? "You're already on the list — thanks!"
        : "You're in! Check your inbox for a welcome note."
    });
  } catch (error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error("[newsletter]", error);
    return res.status(status).json({ ok: false, error: error.message || "Could not subscribe." });
  }
}
