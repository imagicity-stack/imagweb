# Imagicity Marketing Website

A multi-page Next.js website for Imagicity, a creative marketing agency. The site mirrors the bold, playful aesthetic from the provided reference and includes dedicated pages for About Us, Services, Portfolio, and Contact.

## Pages

- Home
- About Us
- Services
- Portfolio
- Blog (`/blog`) — SEO-optimized, powered by Firebase
- Contact

## Design system

The public site uses one loud, brand-led UI: cream paper, ink outlines, the
Imagicity yellow `#FAE80C` and red `#ED2041`, Anton display type and Permanent
Marker accents. Styles live in `styles/site.css` (scoped to the `.ix` layout);
`styles/globals.css` keeps the blog, admin and popup styles.

Motion: a first-visit logo opener (`components/Intro.js`), branded page wipes
between routes (`components/RouteWipe.js`), a cursor halo, magnetic buttons,
tilt cards, scroll reveals, a pinned horizontal work rail and marquee tapes.
Everything animates transform/opacity only and respects `prefers-reduced-motion`.

### Imagery

Photos are free Unsplash stock served from their CDN, catalogued in
`lib/media.js` (`IMG`, `SERVICE_IMAGES`, `CITIES`) and case studies in
`lib/work.js`. Replace an entry's id with your own shots (or point it at a file
in `/public`) to swap any image site-wide.

## Blog + Admin

A state-of-the-art, SEO-first blog with a WordPress-style admin at `/admin`,
powered by Firebase (Auth, Firestore, Storage) with Google Gemini for AI SEO
checks. Configuration is entirely via environment variables (no secrets in code).

See **[BLOG_SETUP.md](./BLOG_SETUP.md)** for the full setup checklist (registering
the Firebase Web App, enabling Email/Google/Phone auth, env vars, and deploying
security rules).

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build

```bash
npm run build
npm start
```
