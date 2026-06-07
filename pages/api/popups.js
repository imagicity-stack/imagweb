// Public: active popups for the marketing site. The client decides which one to
// show (page targeting + frequency cap) so this stays cacheable.

import { getActivePopups } from "../../lib/popupsServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false });
  }

  let popups = [];
  try {
    popups = await getActivePopups();
  } catch (error) {
    popups = [];
  }

  const lean = popups.map((p) => ({
    id: p.id,
    heading: p.heading,
    body: p.body,
    image: p.image,
    ctaLabel: p.ctaLabel,
    ctaUrl: p.ctaUrl,
    theme: p.theme,
    size: p.size,
    layout: p.layout,
    align: p.align,
    ctaAlign: p.ctaAlign,
    ctaStyle: p.ctaStyle,
    pages: p.pages,
    trigger: p.trigger,
    frequency: p.frequency
  }));

  // No edge cache so popups created/toggled in the admin reflect immediately.
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true, popups: lean });
}
