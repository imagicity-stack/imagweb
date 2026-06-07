import nodemailer from "nodemailer";
import { SITE_NAME, SITE_URL } from "./site";

/*
Required env vars: SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS MAIL_TO.
Vercel needs redeploy after env changes.
*/

export const isMailConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

const FROM = `Imagicity <${process.env.SMTP_USER}>`;

const sanitize = (value) => {
  if (!value) {
    return "";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const sendContactMail = async ({
  name,
  email,
  phone,
  subject,
  message,
  sourceUrl
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const safeName = sanitize(name);
  const safeEmail = sanitize(email);
  const safePhone = sanitize(phone);
  const safeSubject = sanitize(subject);
  const safeMessage = sanitize(message).replace(/\n/g, "<br />");
  const safeSourceUrl = sanitize(sourceUrl);

  const html = `
    <div>
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <p><strong>Message:</strong><br />${safeMessage}</p>
      ${safeSourceUrl ? `<p><strong>Source:</strong> ${safeSourceUrl}</p>` : ""}
    </div>
  `;

  await transporter.sendMail({
    from: `IMAGICITY Website <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_TO,
    subject: "New Contact Form Submission | IMAGICITY",
    replyTo: safeEmail,
    html
  });
};

// ---------- Newsletter emails ----------

// A reusable, email-client-safe HTML shell (inline styles only).
const emailShell = ({ preheader = "", title, intro, bodyHtml, ctaLabel, ctaUrl, footerNote }) => `
  <div style="margin:0;padding:0;background:#f4f4f6;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${sanitize(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f6;padding:28px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:92%;background:#ffffff;border:1px solid #e6e7ec;border-radius:16px;overflow:hidden;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
          <tr><td style="background:#15171c;padding:22px 32px;">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.01em;">Imagicity</span>
            <span style="color:#ff5b86;font-size:20px;font-weight:700;">.</span>
          </td></tr>
          <tr><td style="padding:34px 32px 8px;">
            <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;color:#15171c;font-weight:700;">${title}</h1>
            ${intro ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3c424e;">${intro}</p>` : ""}
            ${bodyHtml || ""}
            ${
              ctaLabel && ctaUrl
                ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="border-radius:999px;background:#d11149;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:999px;">${ctaLabel}</a>
                  </td></tr></table>`
                : ""
            }
          </td></tr>
          <tr><td style="padding:24px 32px 30px;border-top:1px solid #f0f1f4;">
            <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#8a909a;">${
              footerNote || `You're receiving this because you subscribed at ${SITE_URL}.`
            }</p>
            <p style="margin:0;font-size:13px;color:#8a909a;">© ${new Date().getFullYear()} ${SITE_NAME} · Hyderabad · Bengaluru · Dubai<br/>
            To unsubscribe, reply to this email with “unsubscribe”.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>
`;

// Welcome / thank-you email when someone subscribes.
export const sendNewsletterWelcome = async ({ name, email }) => {
  if (!isMailConfigured) return;
  const safeName = sanitize(name) || "there";
  const html = emailShell({
    preheader: "Thanks for subscribing to the Imagicity Journal.",
    title: `Welcome aboard, ${safeName} 🎉`,
    intro:
      "Thank you for subscribing to the Imagicity Journal — we're thrilled to have you. You'll be the first to know whenever we publish new marketing playbooks, brand strategy, and growth insights.",
    bodyHtml: `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3c424e;">No fluff, no spam — just practical ideas to help your brand grow louder.</p>`,
    ctaLabel: "Explore the Journal",
    ctaUrl: `${SITE_URL}/blog`,
    footerNote: `You're receiving this because you subscribed with ${sanitize(email)}.`
  });

  await createTransporter().sendMail({
    from: FROM,
    to: email,
    subject: "Welcome to the Imagicity Journal 🎉",
    html
  });
};

// Notify all subscribers that a new post is live (BCC, so addresses stay private).
export const sendNewPostNotification = async ({ emails, post }) => {
  if (!isMailConfigured || !emails || !emails.length) return;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const safeTitle = sanitize(post.title);
  const safeExcerpt = sanitize(post.excerpt || "");
  const cover =
    post.coverImage && post.coverImage.url
      ? `<img src="${escapeUrl(post.coverImage.url)}" alt="" width="536" style="width:100%;border-radius:12px;margin:0 0 20px;" />`
      : "";

  const html = emailShell({
    preheader: safeExcerpt || `New on the Imagicity Journal: ${safeTitle}`,
    title: safeTitle,
    intro: post.category ? `New in ${sanitize(post.category)}` : "Fresh from the Journal",
    bodyHtml: `${cover}${
      safeExcerpt
        ? `<p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#3c424e;">${safeExcerpt}</p>`
        : ""
    }`,
    ctaLabel: "Read the article",
    ctaUrl: url
  });

  await createTransporter().sendMail({
    from: FROM,
    to: process.env.MAIL_TO || process.env.SMTP_USER,
    bcc: emails.join(","),
    subject: `New on the Imagicity Journal: ${post.title}`,
    html
  });
};

const escapeUrl = (value) =>
  String(value || "").replace(/"/g, "%22").replace(/</g, "%3C").replace(/>/g, "%3E");
