// Thin wrapper around the Google Gemini REST API used for SEO analysis and
// AI writing assistance. The API key comes from GEMINI_API_KEY (Vercel env)
// and is only ever used on the server.

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models";

// Current models, newest first. If one is retired (404) we automatically fall
// back to the next, so the feature keeps working as Google rotates models.
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash-001"
];

export const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

function candidateModels(preferred) {
  const list = [preferred, process.env.GEMINI_MODEL, ...FALLBACK_MODELS].filter(Boolean);
  return [...new Set(list)];
}

function extractText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || ""
  );
}

export async function callGemini(
  prompt,
  { json = false, system, temperature = 0.4, model } = {}
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

  const models = candidateModels(model);
  let lastError = null;

  for (const candidate of models) {
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(`${API_ROOT}/${candidate}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      // eslint-disable-next-line no-await-in-loop
      const data = await response.json();
      return extractText(data).trim();
    }

    // eslint-disable-next-line no-await-in-loop
    const detail = await response.text().catch(() => "");

    // A retired/unknown model → try the next candidate.
    if (response.status === 404) {
      lastError = new Error(`Model ${candidate} unavailable.`);
      continue;
    }

    const error = new Error(
      `Gemini request failed (${response.status}). ${detail.slice(0, 280)}`
    );
    error.code = "gemini/request-failed";
    error.statusCode = response.status === 429 ? 429 : 502;
    throw error;
  }

  const error = new Error(
    `No available Gemini model. Tried: ${models.join(", ")}. ${lastError?.message || ""}`
  );
  error.code = "gemini/no-model";
  error.statusCode = 502;
  throw error;
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
