import Script from "next/script";
import { useRouter } from "next/router";
import Intro from "../components/Intro";
import RouteWipe from "../components/RouteWipe";
import Cursor from "../components/Cursor";
import Interactions from "../components/Interactions";
import "../styles/globals.css";
import "../styles/site.css";

// Google Analytics (gtag.js). Override per-environment with NEXT_PUBLIC_GA_ID.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-HWCGBP7NVK";

const isBackOffice = (pathname) =>
  pathname.startsWith("/admin") || pathname.startsWith("/creacity/admin");

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const publicSite = !isBackOffice(router.pathname);

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      ) : null}
      {publicSite ? (
        <>
          <Intro />
          <RouteWipe />
          <Cursor />
          <Interactions />
        </>
      ) : null}
      <Component {...pageProps} />
    </>
  );
}
