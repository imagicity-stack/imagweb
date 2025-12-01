import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ClientRoot from "@/components/ClientRoot";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"]
});

const siteName = "Imagicity";
const siteUrl = "https://imagicity.example";

export const metadata: Metadata = {
  title: `${siteName} | Bold Creative Marketing Agency`,
  description:
    "Bold, minimal, and futuristic creative marketing agency crafting GTM strategy, design, web builds, and campaign planning with measurable performance.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: `${siteName} | Creative Strategy & Premium Execution`,
    description:
      "Strategy-led creative agency delivering GTM systems, design, and immersive digital experiences.",
    url: siteUrl,
    siteName,
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} preview`
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    site: "@imagicity",
    creator: "@imagicity",
    title: `${siteName} | Creative Marketing`,
    description:
      "Premium creative marketing studio building futuristic brands with strategy, content, and technology."
  },
  keywords: [
    "creative agency",
    "marketing",
    "GTM strategy",
    "website development",
    "design studio",
    "framer motion",
    "gsap",
    "lenis"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description:
      "Creative marketing agency blending GTM strategy, design systems, campaign planning, and conversion-first web experiences.",
    sameAs: [
      "https://www.linkedin.com/company/imagicity",
      "https://www.behance.net/imagicity"
    ],
    logo: `${siteUrl}/logo.svg`
  };

  return (
    <html lang="en" className="bg-black">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ClientRoot>{children}</ClientRoot>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
