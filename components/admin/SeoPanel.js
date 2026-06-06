import { useMemo, useState } from "react";
import { computeSeoScore } from "../../lib/blog";
import { SITE_URL } from "../../lib/site";

const host = SITE_URL.replace(/^https?:\/\//, "");

function counterTone(length, min, max) {
  if (length >= min && length <= max) return "good";
  if (length >= min - 10 && length <= max + 10) return "warn";
  return "bad";
}

function ScoreRing({ score, tone }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className={`seo-ring ${tone}`}>
      <circle cx="32" cy="32" r={radius} className="seo-ring-track" />
      <circle
        cx="32"
        cy="32"
        r={radius}
        className="seo-ring-value"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" className="seo-ring-text">
        {score}
      </text>
    </svg>
  );
}

export default function SeoPanel({
  title,
  slug,
  content,
  excerpt,
  coverImageUrl,
  seo,
  onSeoChange,
  onChangeTitle,
  onAddTags,
  getToken
}) {
  const analysis = useMemo(
    () =>
      computeSeoScore({
        title,
        seoTitle: seo.title,
        metaDescription: seo.description,
        focusKeyword: seo.focusKeyword,
        slug,
        excerpt,
        content,
        coverImageUrl
      }),
    [title, seo.title, seo.description, seo.focusKeyword, slug, excerpt, content, coverImageUrl]
  );

  const [ai, setAi] = useState(null);
  const [aiError, setAiError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [assisting, setAssisting] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [notice, setNotice] = useState("");

  const seoTitle = seo.title || title || "";
  const metaDescription = seo.description || "";

  const analyze = async () => {
    setAnalyzing(true);
    setAiError("");
    try {
      const token = await getToken();
      const response = await fetch("/api/admin/seo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          seoTitle: seo.title,
          metaDescription: seo.description,
          focusKeyword: seo.focusKeyword,
          content,
          slug,
          excerpt,
          coverImageUrl
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setAiError(data.error || "Analysis failed.");
        return;
      }
      setAi(data.ai);
      setAiError(data.aiError || "");
    } catch (error) {
      setAiError(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const assist = async (task) => {
    setAssisting(task);
    setAiError("");
    setNotice("");
    try {
      const token = await getToken();
      const response = await fetch("/api/admin/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          task,
          context: { title, focusKeyword: seo.focusKeyword, content }
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setAiError(data.error || "Request failed.");
        return;
      }
      if (task === "meta") {
        onSeoChange("description", data.result);
        setNotice("Meta description generated.");
      } else if (task === "titles") {
        setSuggestions({ type: "titles", items: data.list || [] });
      } else if (task === "keywords") {
        setSuggestions({ type: "keywords", items: data.list || [] });
      } else if (task === "tags") {
        setSuggestions({ type: "tags", items: data.list || [] });
      }
    } catch (error) {
      setAiError(error.message);
    } finally {
      setAssisting("");
    }
  };

  const applySuggestion = (value) => {
    if (!suggestions) return;
    if (suggestions.type === "titles") {
      onSeoChange("title", value);
      if (!title) onChangeTitle(value);
      setNotice("SEO title applied.");
    } else if (suggestions.type === "keywords") {
      onSeoChange("focusKeyword", value);
      setNotice(`Focus keyword set to “${value}”.`);
    } else if (suggestions.type === "tags") {
      onAddTags([value]);
      setNotice(`Tag “${value}” added.`);
    }
  };

  return (
    <div className="seo-panel">
      <div className="seo-head">
        <ScoreRing score={analysis.score} tone={analysis.tone} />
        <div>
          <div className="seo-head-label">SEO score</div>
          <div className={`seo-head-value ${analysis.tone}`}>{analysis.label}</div>
          <div className="seo-head-stats">
            {analysis.stats.words} words · {analysis.stats.headings} headings ·{" "}
            {analysis.stats.images} images
          </div>
        </div>
      </div>

      <div className="seo-snippet" aria-label="Search result preview">
        <div className="seo-snippet-url">
          {host} › blog › {slug || "your-post"}
        </div>
        <div className="seo-snippet-title">
          {seoTitle || "Your SEO title will appear here"}
        </div>
        <div className="seo-snippet-desc">
          {metaDescription || excerpt || "Your meta description preview shows here. Write 120–160 characters that earn the click."}
        </div>
      </div>

      <label className="seo-field">
        <span>Focus keyword</span>
        <input
          type="text"
          value={seo.focusKeyword}
          onChange={(e) => onSeoChange("focusKeyword", e.target.value)}
          placeholder="e.g. performance marketing"
        />
      </label>

      <label className="seo-field">
        <span>
          SEO title{" "}
          <em className={counterTone(seoTitle.length, 30, 60)}>{seoTitle.length}/60</em>
        </span>
        <input
          type="text"
          value={seo.title}
          onChange={(e) => onSeoChange("title", e.target.value)}
          placeholder={title || "Custom SEO title"}
        />
      </label>

      <label className="seo-field">
        <span>
          Meta description{" "}
          <em className={counterTone(metaDescription.length, 120, 160)}>
            {metaDescription.length}/160
          </em>
        </span>
        <textarea
          rows={3}
          value={seo.description}
          onChange={(e) => onSeoChange("description", e.target.value)}
          placeholder="Compelling summary that earns the click…"
        />
      </label>

      <div className="seo-ai">
        <button
          type="button"
          className="btn btn-glow seo-ai-analyze"
          onClick={analyze}
          disabled={analyzing}
        >
          {analyzing ? "Analyzing…" : "✦ Analyze with Gemini"}
        </button>
        <div className="seo-ai-row">
          <button type="button" onClick={() => assist("meta")} disabled={assisting === "meta"}>
            {assisting === "meta" ? "…" : "✦ Meta"}
          </button>
          <button type="button" onClick={() => assist("titles")} disabled={assisting === "titles"}>
            {assisting === "titles" ? "…" : "✦ Titles"}
          </button>
          <button type="button" onClick={() => assist("keywords")} disabled={assisting === "keywords"}>
            {assisting === "keywords" ? "…" : "✦ Keywords"}
          </button>
          <button type="button" onClick={() => assist("tags")} disabled={assisting === "tags"}>
            {assisting === "tags" ? "…" : "✦ Tags"}
          </button>
        </div>
      </div>

      {notice ? <p className="seo-notice">{notice}</p> : null}
      {aiError ? <p className="seo-error">{aiError}</p> : null}

      {suggestions?.items?.length ? (
        <div className="seo-suggestions">
          <div className="seo-suggestions-label">
            Tap to apply ({suggestions.type})
          </div>
          <div className="seo-suggestion-chips">
            {suggestions.items.map((item) => (
              <button key={item} type="button" onClick={() => applySuggestion(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {ai ? (
        <div className="seo-ai-result">
          <div className="seo-ai-score">
            <span>Gemini score</span>
            <strong>{ai.score ?? "–"}/100</strong>
          </div>
          {ai.summary ? <p className="seo-ai-summary">{ai.summary}</p> : null}
          {ai.improvedMetaDescription ? (
            <button
              type="button"
              className="seo-apply"
              onClick={() => {
                onSeoChange("description", ai.improvedMetaDescription);
                setNotice("Applied Gemini meta description.");
              }}
            >
              Use suggested meta description →
            </button>
          ) : null}
          {ai.improvedTitle ? (
            <button
              type="button"
              className="seo-apply"
              onClick={() => {
                onSeoChange("title", ai.improvedTitle);
                setNotice("Applied Gemini SEO title.");
              }}
            >
              Use suggested SEO title →
            </button>
          ) : null}
          {Array.isArray(ai.issues) && ai.issues.length ? (
            <ul className="seo-ai-issues">
              {ai.issues.map((issue, index) => (
                <li key={index} className={`sev-${issue.severity || "low"}`}>
                  <strong>{issue.title}</strong>
                  <span>{issue.recommendation}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {Array.isArray(ai.suggestedTags) && ai.suggestedTags.length ? (
            <div className="seo-suggestions">
              <div className="seo-suggestions-label">Suggested tags</div>
              <div className="seo-suggestion-chips">
                {ai.suggestedTags.map((tag) => (
                  <button key={tag} type="button" onClick={() => onAddTags([tag])}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="seo-divider" />

      <label className="seo-field">
        <span>Canonical URL (optional)</span>
        <input
          type="text"
          value={seo.canonicalUrl}
          onChange={(e) => onSeoChange("canonicalUrl", e.target.value)}
          placeholder="Leave blank to use the default"
        />
      </label>

      <label className="seo-toggle">
        <input
          type="checkbox"
          checked={seo.noindex}
          onChange={(e) => onSeoChange("noindex", e.target.checked)}
        />
        <span>Hide from search engines (noindex)</span>
      </label>

      <details className="seo-checklist">
        <summary>SEO checklist ({analysis.checks.filter((c) => c.status === "good").length}/{analysis.checks.length})</summary>
        <ul>
          {analysis.checks.map((check) => (
            <li key={check.id} className={`check-${check.status}`}>
              <span className="check-dot" aria-hidden="true" />
              <div>
                <strong>{check.label}</strong>
                {check.status !== "good" ? <span>{check.advice}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
