import { Html, Head, Main, NextScript } from "next/document";

// Runs before first paint: decides whether the logo opener plays, so repeat
// visits in the same tab, reduced-motion users and the admin never see it
// flash. Kept tiny and dependency-free on purpose.
const introScript = `(function(){var d=document.documentElement;try{var p=location.pathname;var seen=sessionStorage.getItem('ix-intro');var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(seen||rm||/^\\/(admin|creacity\\/admin)/.test(p)){d.classList.add('no-intro')}else{d.classList.add('intro-on')}}catch(e){d.classList.add('no-intro')}})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Permanent+Marker&family=Roboto:wght@900&family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
        {/* Brand mark favicons: ICO for legacy browsers and the default /favicon.ico
            request, SVG for crisp modern tabs, PNGs for home screens. */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#FFF7E8" />
        <meta name="facebook-domain-verification" content="g60kcuqnyvr8elm72rzi6iconwsxnx" />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".reveal,.reveal-clip>*{opacity:1!important;transform:none!important;clip-path:none!important}.ix-intro,.ix-wipe{display:none!important}.ix-wi,.ix-hl-in{transform:none!important}"
            }}
          />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
