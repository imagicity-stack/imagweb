import { sendContactMail } from "../../lib/mailer";
import { getRequestIp } from "../../lib/geo";
import { createRateLimiter } from "../../lib/rateLimit";
import { cleanString, isValidEmail } from "../../lib/validate";

// The form posts a few short fields; nothing legitimate comes near this.
export const config = { api: { bodyParser: { sizeLimit: "32kb" } } };

const isRateLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

const LIMITS = { name: 120, email: 254, phone: 30, subject: 200, message: 5000 };
const LABELS = {
  name: "Name",
  email: "Email",
  phone: "Phone number",
  subject: "Subject",
  message: "Message"
};

const validatePayload = (payload) => {
  const errors = {};
  Object.keys(LIMITS).forEach((field) => {
    const value = payload[field];
    if (!value) errors[field] = `${LABELS[field]} is required.`;
    else if (value.length > LIMITS[field]) {
      errors[field] = `${LABELS[field]} must be ${LIMITS[field]} characters or fewer.`;
    }
  });
  if (!errors.email && !isValidEmail(payload.email)) {
    errors.email = "Please enter a valid email address.";
  }
  return errors;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  // Honeypot: a hidden field real visitors never fill. Pretend it worked.
  if (body.website) return res.status(200).json({ ok: true });

  if (isRateLimited(getRequestIp(req))) {
    return res.status(429).json({ ok: false, message: "Too many messages. Please try again later." });
  }

  // Non-strings become "" (and fail "required") instead of crashing the handler.
  const payload = {
    name: cleanString(body.name),
    email: cleanString(body.email),
    phone: cleanString(body.phone),
    subject: cleanString(body.subject),
    message: cleanString(body.message)
  };
  const errors = validatePayload(payload);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, message: Object.values(errors)[0], errors });
  }

  try {
    await sendContactMail({
      ...payload,
      sourceUrl: cleanString(req.headers.referer, 500)
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[contact]", error.message);
    return res.status(500).json({ ok: false, message: "Server error." });
  }
}
