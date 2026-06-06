// Gemini-powered writing assistance for the editor: meta descriptions, title
// ideas, excerpts, keyword/tag suggestions and content outlines.

import { verifyAdminRequest, handleApiError } from "../../../lib/adminAuth";
import { callGemini, callGeminiJson, isGeminiConfigured } from "../../../lib/gemini";
import { stripHtml } from "../../../lib/blog";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

const SYSTEM =
  "You are an expert content marketer and SEO copywriter for a premium creative marketing agency. Write with clarity, energy and zero fluff.";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    await verifyAdminRequest(req);

    if (!isGeminiConfigured) {
      return res.status(503).json({
        ok: false,
        error: "Add GEMINI_API_KEY in your Vercel environment to enable AI assistance."
      });
    }

    const { task } = req.body || {};
    const ctx = req.body?.context || {};
    const title = String(ctx.title || "").trim();
    const focusKeyword = String(ctx.focusKeyword || "").trim();
    const text = stripHtml(ctx.content || "").slice(0, 9000);
    const topic = title || focusKeyword || "the article topic";

    switch (task) {
      case "meta": {
        const result = await callGemini(
          `Write one compelling, click-worthy SEO meta description (strictly 150-160 characters) for a blog post titled "${title}". Focus keyword: "${focusKeyword || "n/a"}". Naturally include the focus keyword. Article context: """${text}""". Return only the meta description text with no quotes or labels.`,
          { system: SYSTEM, temperature: 0.6 }
        );
        return res.status(200).json({ ok: true, result: result.replace(/^["']|["']$/g, "") });
      }

      case "excerpt": {
        const result = await callGemini(
          `Write a punchy 1-2 sentence excerpt (max 220 characters) to introduce this blog post titled "${title}". Article context: """${text}""". Return only the excerpt text.`,
          { system: SYSTEM, temperature: 0.6 }
        );
        return res.status(200).json({ ok: true, result: result.replace(/^["']|["']$/g, "") });
      }

      case "titles": {
        const data = await callGeminiJson(
          `Suggest 6 SEO-optimized, engaging blog post titles about "${topic}". Focus keyword: "${focusKeyword || "n/a"}". Each under 60 characters. Return JSON: {"titles": ["..."]}.`,
          { system: SYSTEM, temperature: 0.8 }
        );
        return res.status(200).json({ ok: true, list: data.titles || [] });
      }

      case "keywords": {
        const data = await callGeminiJson(
          `Suggest 8 high-intent SEO keywords/phrases for a blog post about "${topic}". Mix short and long-tail. Return JSON: {"keywords": ["..."]}.`,
          { system: SYSTEM, temperature: 0.5 }
        );
        return res.status(200).json({ ok: true, list: data.keywords || [] });
      }

      case "tags": {
        const data = await callGeminiJson(
          `Suggest 6 concise tags (1-2 words each) for a blog post about "${topic}". Return JSON: {"tags": ["..."]}.`,
          { system: SYSTEM, temperature: 0.5 }
        );
        return res.status(200).json({ ok: true, list: data.tags || [] });
      }

      case "outline": {
        const result = await callGemini(
          `Create a clear, SEO-friendly content outline for a blog post titled "${title || topic}". Focus keyword: "${focusKeyword || "n/a"}". Use H2/H3 headings and short bullet notes. Return clean HTML using <h2>, <h3>, <ul>, <li> tags only.`,
          { system: SYSTEM, temperature: 0.6 }
        );
        return res.status(200).json({ ok: true, html: result });
      }

      default:
        return res.status(400).json({ ok: false, error: "Unknown assist task." });
    }
  } catch (error) {
    return handleApiError(res, error);
  }
}
