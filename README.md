# Imagicity Marketing Website

A multi-page Next.js website for Imagicity, a creative marketing agency. The site mirrors the bold, playful aesthetic from the provided reference and includes dedicated pages for About Us, Services, Portfolio, and Contact.

## Pages

- Home
- About Us
- Services
- Portfolio
- Blog (`/blog`) — SEO-optimized, powered by Firebase
- Contact

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
