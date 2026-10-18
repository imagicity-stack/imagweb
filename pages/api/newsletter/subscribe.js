// Public newsletter signup. Stores the subscriber and sends a branded
// thank-you email. Honeypot + light rate limiting guard against bots.

import { subscribeEmail } from "../../../lib/newsletterServer";
import { sendNewsletterWelcome } from "../../../lib/mailer";
import { getRequestIp } from "../../../lib/geo";
import { createRateLimiter } from "../../../lib/rateLimit";

export const config = { api: { bodyParser: { sizeLimit: "8kb" } } };

const isRateLimited = createRateLimiter({ windowMs: 60 * 1000, max: 5 });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    // Honeypot — bots fill hidden fields; humans never do.
    if (body.website) return res.status(200).json({ ok: true });

    if (isRateLimited(getRequestIp(req))) {
      return res.status(429).json({ ok: false, error: "Please try again in a moment." });
    }

    const result = await subscribeEmail({ name: body.name, email: body.email });

    // Send the welcome email only to brand-new subscribers; never block on it.
    if (result.created) {
      try {
        await sendNewsletterWelcome({ email: result.email });
      } catch (mailError) {
        console.error("[newsletter] welcome email failed:", mailError.message);
      }
    }

    // Same answer whether or not the address was already on the list, so the
    // form can't be used to check who subscribes.
    return res.status(200).json({
      ok: true,
      message: "You're on the list! Keep an eye on your inbox."
    });
  } catch (error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error("[newsletter]", error);
    return res.status(status).json({
      ok: false,
      error: status < 500 && error.message ? error.message : "Could not subscribe. Please try again."
    });
  }
}
