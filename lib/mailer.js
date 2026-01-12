import nodemailer from "nodemailer";

/*
Required env vars: SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS MAIL_TO.
Vercel needs redeploy after env changes.
*/

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
