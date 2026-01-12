import { sendContactMail } from "../../lib/mailer";

const requestLog = new Map();
const oneHourMs = 60 * 60 * 1000;
const maxRequests = 5;

const getClientIp = (req) => {
  const forwardHeader = `x${String.fromCharCode(45)}forwarded${String.fromCharCode(45)}for`;
  const forwarded = req.headers[forwardHeader];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
};

const validatePayload = (payload) => {
  const errors = {};
  if (!payload.name) {
    errors.name = "Name is required.";
  }
  if (!payload.email) {
    errors.email = "Email is required.";
  }
  if (!payload.phone) {
    errors.phone = "Phone number is required.";
  }
  if (!payload.subject) {
    errors.subject = "Subject is required.";
  }
  if (!payload.message) {
    errors.message = "Message is required.";
  }
  return errors;
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const entries = requestLog.get(ip) || [];
  const recentEntries = entries.filter((timestamp) => now - timestamp < oneHourMs);
  requestLog.set(ip, recentEntries);
  if (recentEntries.length >= maxRequests) {
    return true;
  }
  recentEntries.push(now);
  requestLog.set(ip, recentEntries);
  return false;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ ok: false, message: "Rate limit exceeded." });
  }

  const { name, email, phone, subject, message } = req.body || {};
  const errors = validatePayload({
    name: name?.trim(),
    email: email?.trim(),
    phone: phone?.trim(),
    subject: subject?.trim(),
    message: message?.trim()
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    await sendContactMail({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      sourceUrl: req.headers.referer || ""
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error." });
  }
}
