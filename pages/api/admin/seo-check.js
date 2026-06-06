// Gemini-powered SEO analysis for the post editor.
// Always returns the local heuristic score; augments it with an AI review
// when GEMINI_API_KEY is configured.

import { verifyAdminRequest, handleApiError } from "../../../lib/adminAuth";
import { callGeminiJson, isGeminiConfigured } from "../../../lib/gemini";
import { stripHtml, computeSeoScore } from "../../../lib/blog";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    await verifyAdminRequest(req);
    const {
      title,
      seoTitle,
      metaDescription,
      focusKeyword,
      content,
      slug,
      excerpt,
      coverImageUrl
    } = req.body || {};

    const heuristic = computeSeoScore({
      title,
      seoTitle,
      metaDescription,
      focusKeyword,
      slug,
      excerpt,
      content,
      coverImageUrl
    });

    let ai = null;
    let aiError = null;

    if (!isGeminiConfigured) {
      aiError = "Add GEMINI_API_KEY in your Vercel environment to enable AI SEO analysis.";
    } else {
      try {
        const articleText = stripHtml(content).slice(0, 9000);
        const prompt = [
          "You are a world-class SEO strategist reviewing a blog post draft for an agency website.",
          `Focus keyword: "${focusKeyword || "(not set)"}"`,
          `SEO title: "${seoTitle || title || "(empty)"}"`,
          `Meta description: "${metaDescription || "(empty)"}"`,
          `URL slug: "${slug || "(empty)"}"`,
          "Article text (truncated):",
          `"""${articleText}"""`,
          "",
          "Return ONLY JSON with this exact shape:",
          `{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "issues": [{"severity": "high|medium|low", "title": "<short>", "recommendation": "<specific, actionable fix>"}],
  "improvedTitle": "<an SEO title under 60 chars>",
  "improvedMetaDescription": "<a meta description 120-160 chars>",
  "suggestedKeywords": ["<related keyword>", "..."],
  "suggestedTags": ["<tag>", "..."]
}`
        ].join("\n");

        ai = await callGeminiJson(prompt, {
          system:
            "You are an expert SEO analyst. Respond with valid JSON only — no markdown, no commentary. Be specific and practical.",
          temperature: 0.3
        });
      } catch (error) {
        aiError = error.message;
      }
    }

    return res.status(200).json({ ok: true, heuristic, ai, aiError });
  } catch (error) {
    return handleApiError(res, error);
  }
}
