import Head from "next/head";
import { useRouter } from "next/router";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "../lib/site";

// Centralized SEO <head> used by both the marketing Layout and the news-style
// blog layout so meta tags stay consistent everywhere.
export default function SeoHead({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage,
  keywords,
  noindex = false,
  article = null,
  jsonLd = null
}) {
  const router = useRouter();
  const pageTitle = title
    ? `${title} · ${SITE_NAME}`
    : `${SITE_NAME} — Creative Marketing Agency`;
  const canonicalUrl =
    canonical || absoluteUrl((router.asPath || "/").split("?")[0].split("#")[0]);
  const resolvedOgImage = ogImage ? absoluteUrl(ogImage) : DEFAULT_OG_IMAGE;
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}
      />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      {article ? (
        <>
          {article.publishedTime ? (
            <meta property="article:published_time" content={article.publishedTime} />
          ) : null}
          {article.modifiedTime ? (
            <meta property="article:modified_time" content={article.modifiedTime} />
          ) : null}
          {article.author ? (
            <meta property="article:author" content={article.author} />
          ) : null}
          {article.section ? (
            <meta property="article:section" content={article.section} />
          ) : null}
          {(article.tags || []).map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      ) : null}
      {jsonLdItems.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
}
