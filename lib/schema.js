// Brand identity (entity home) structured data. Emitted on every page via
// SeoHead so search engines and AI crawlers resolve a single, canonical
// Organization + WebSite entity for Imagicity. Nodes use stable @id values so
// page-level schema (BlogPosting, Service, etc.) can reference them.

import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LOCATIONS,
  SOCIAL_PROFILES,
  absoluteUrl
} from "./site";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

const LOGO_URL = absoluteUrl("/ICONS/SSA.png");

export function getIdentitySchema() {
  const sameAs = SOCIAL_PROFILES.map((profile) => profile.url).filter(Boolean);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      caption: SITE_NAME
    },
    image: { "@id": LOGO_ID },
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    areaServed: LOCATIONS,
    knowsAbout: [
      "Marketing strategy",
      "Go-to-market strategy",
      "Brand positioning",
      "Performance marketing",
      "Lead generation",
      "Content marketing",
      "Marketing automation",
      "Conversion rate optimization"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      areaServed: ["IN", "AE"],
      availableLanguage: ["English", "Hindi"]
    },
    ...(sameAs.length ? { sameAs } : {})
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": ORG_ID }
  };

  return [organization, website];
}
