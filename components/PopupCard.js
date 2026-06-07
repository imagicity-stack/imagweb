// Presentational popup card, shared by the public SitePopup and the admin live
// preview so both always render identical layouts/styles. Pass `preview` to make
// it non-interactive (admin builder).

export default function PopupCard({ popup, onClose, onCta, preview = false }) {
  const {
    heading,
    body,
    image,
    ctaLabel,
    ctaUrl,
    theme = "light",
    size = "md",
    layout = "top",
    align = "left",
    ctaAlign = "left",
    ctaStyle = "solid"
  } = popup || {};

  const className = [
    "site-popup",
    `site-popup-${theme}`,
    `site-popup-${size}`,
    `site-popup-layout-${layout}`,
    `site-popup-align-${align}`
  ].join(" ");

  const isEmpty = !heading && !body && !image?.url;
  const ctaClass = `site-popup-cta site-popup-cta-${ctaStyle}`;
  const external = /^https?:\/\//i.test(ctaUrl || "");

  return (
    <div
      className={className}
      onClick={preview ? undefined : (event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="site-popup-close"
        onClick={preview ? undefined : onClose}
        aria-label="Close"
        {...(preview ? { tabIndex: -1, "aria-hidden": true } : {})}
      >
        ×
      </button>

      {image?.url ? (
        <div className="site-popup-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={image.alt || ""} />
        </div>
      ) : null}

      <div className="site-popup-content">
        {heading ? <h3 className="site-popup-heading">{heading}</h3> : null}
        {body ? <p className="site-popup-text">{body}</p> : null}

        {ctaLabel ? (
          <div className={`site-popup-actions site-popup-actions-${ctaAlign}`}>
            {preview ? (
              <span className={ctaClass} role="button" tabIndex={-1}>
                {ctaLabel}
              </span>
            ) : ctaUrl ? (
              <a
                className={ctaClass}
                href={ctaUrl}
                onClick={onCta}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {ctaLabel}
              </a>
            ) : null}
          </div>
        ) : null}

        {preview && isEmpty ? (
          <p className="pop-preview-hint">Your popup preview appears here.</p>
        ) : null}
      </div>
    </div>
  );
}
