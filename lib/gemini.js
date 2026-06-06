// Thin wrapper around the Google Gemini REST API used for SEO analysis and
// AI writing assistance. The API key comes from GEMINI_API_KEY (Vercel env)
// and is only ever used on the server.

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models";

export const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

export async function callGemini(
  prompt,
  { json = false, system, temperature = 0.4, model = DEFAULT_MODEL } = {}
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error(
      "Gemini is not configured. Set the GEMINI_API_KEY environment variable."
    );
    error.code = "gemini/not-configured";
    error.statusCode = 503;
    throw error;
  }

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      ...(json ? { responseMimeType: "application/json" } : {})
    }
  };
  if (system) {
    body.systemInstruction = { parts: [{ text: system }] };
  }

  const response = await fetch(
    `${API_ROOT}/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(
      `Gemini request failed (${response.status}). ${detail.slice(0, 280)}`
    );
    error.code = "gemini/request-failed";
    error.statusCode = response.status === 429 ? 429 : 502;
    throw error;
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || "";
  return text.trim();
}

// Calls Gemini expecting a JSON document and parses it defensively
// (models sometimes wrap JSON in code fences).
export async function callGeminiJson(prompt, options = {}) {
  const raw = await callGemini(prompt, { ...options, json: true });
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Gemini returned a response that could not be parsed as JSON.");
  }
}
