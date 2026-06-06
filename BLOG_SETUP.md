# Imagicity Blog + Admin — Setup Guide

A state-of-the-art, SEO-first blog with a WordPress-style admin at `/admin`,
powered by **Firebase** (Auth + Firestore + Storage) and **Google Gemini** for
AI SEO checks. All secrets are read from environment variables (Vercel) — nothing
is hardcoded.

> Firebase project number: **654267860574**

---

## What you get

- **Public blog** at `/blog` and `/blog/[slug]` — statically generated with ISR
  (fast + always fresh), full Open Graph/Twitter cards, JSON-LD (`BlogPosting` +
  `BreadcrumbList`), canonical URLs, per-post `noindex`, and an auto-updating
  `/sitemap.xml`.
- **Admin** at `/admin` — sign in with Email/Password, Google, or Phone (SMS).
- **WordPress-style editor** — rich text toolbar, image uploads to Firebase
  Storage, cover image, categories/tags, excerpt, and a **Yoast-style SEO panel**
  with a live score, Google snippet preview, checklist, and **Gemini** analysis
  + AI writing assistance (titles, meta descriptions, keywords, tags).

---

## 1. Register a Firebase Web App

1. Open the [Firebase Console](https://console.firebase.google.com/) and select
   the project with number **654267860574**.
2. Click the **gear → Project settings**.
3. Under **Your apps**, click the **Web** icon (`</>`).
4. Register the app (e.g. nickname `imagicity-web`). **Do not** enable Firebase
   Hosting (we deploy on Vercel).
5. Copy the `firebaseConfig` values — you’ll paste them into env vars in step 5.

## 2. Enable Authentication providers

Firebase Console → **Authentication → Get started → Sign-in method**, and enable:

- **Email/Password**
- **Google** (set a support email)
- **Phone**

Then go to **Authentication → Settings → Authorized domains** and add:

- `localhost`
- your Vercel domains (`your-app.vercel.app`)
- `imagicity.in` and `www.imagicity.in`

> Phone auth uses an invisible reCAPTCHA; authorized domains must include wherever
> you sign in from.

## 3. Create the Firestore database

Firebase Console → **Firestore Database → Create database** → Production mode →
pick a region. The collection (`posts`) is created automatically on first save.

## 4. Enable Cloud Storage

Firebase Console → **Storage → Get started**. Note the bucket name (usually
`<project-id>.appspot.com`) for the env vars.

## 5. Create a service account (Admin SDK)

Firebase Console → **Project settings → Service accounts → Generate new private
key**. This downloads a JSON file containing `project_id`, `client_email`, and
`private_key`. Keep it secret (it’s git-ignored).

## 6. Get a Gemini API key

Create one at [Google AI Studio](https://aistudio.google.com/app/apikey).

## 7. Configure environment variables

Copy `.env.example` → `.env.local` for local dev, and add the **same** variables
in **Vercel → Settings → Environment Variables** (Production + Preview).

| Variable | Where it comes from |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Web app config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Web app config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Web app config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `654267860574` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web app config |
| `FIREBASE_PROJECT_ID` | Service account JSON → `project_id` |
| `FIREBASE_CLIENT_EMAIL` | Service account JSON → `client_email` |
| `FIREBASE_PRIVATE_KEY` | Service account JSON → `private_key` |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `GEMINI_API_KEY` | Google AI Studio |
| `NEXT_PUBLIC_SITE_URL` | `https://imagicity.in` |

### Important: `FIREBASE_PRIVATE_KEY` formatting

The private key contains newlines. Wrap it in **double quotes** and keep the
`\n` escapes, e.g.:

```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n"
```

The app converts `\n` back into real newlines at runtime. In the Vercel UI you
can also paste the real multi-line key directly.

## 8. Deploy the Firestore & Storage security rules

The repo includes `firestore.rules`, `storage.rules`, `firestore.indexes.json`
and `firebase.json`. Deploy them with the Firebase CLI:

```bash
npm i -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
```

> The composite index (`status` + `publishedAt`) is required for the blog
> listing query. If you skip the CLI, Firestore will also print a one-click link
> to create the index the first time the query runs.

## 9. Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

- Visit `/admin`, sign in with an email listed in `ADMIN_EMAILS`.
- The first successful sign-in grants your account an `admin` custom claim
  (used by the Storage/Firestore rules).
- Create a post, add a cover image, fill the SEO panel, click **Analyze with
  Gemini**, then **Publish**.
- The post appears at `/blog/<slug>` and in `/sitemap.xml` within ~60s (ISR), or
  instantly via on-demand revalidation after publishing.

---

## How it works (architecture)

- **Reads (public):** `getStaticProps` + ISR (`revalidate: 60`) read published
  posts through the Admin SDK. New posts use `fallback: 'blocking'`. Publishing
  triggers on-demand revalidation of `/blog`, the post URL, and `/sitemap.xml`.
- **Writes (admin):** Go through protected API routes (`/api/admin/*`) that
  verify a Firebase ID token and the `ADMIN_EMAILS` allowlist, sanitize the HTML
  (`sanitize-html`), compute reading time/word count, and manage slugs.
- **Images:** Uploaded client-side straight to Firebase Storage (no serverless
  size limits), authorized by the `admin` custom claim in `storage.rules`.
- **AI:** `/api/admin/seo-check` and `/api/admin/assist` call Gemini server-side
  with `GEMINI_API_KEY`.
- **Safety:** The site still builds and renders (with an empty blog) before any
  Firebase env vars are set, so deploys never break mid-setup.

## Troubleshooting

- **“Firebase not configured” on /admin** → set the `NEXT_PUBLIC_FIREBASE_*`
  vars and redeploy.
- **“Access denied” after sign-in** → your email isn’t in `ADMIN_EMAILS`.
- **AI buttons say not configured** → set `GEMINI_API_KEY`.
- **Blog listing empty but posts exist** → deploy the Firestore composite index
  (step 8).
- **Phone sign-in fails** → ensure the domain is in Authorized domains and Phone
  auth is enabled.
- **Image upload denied** → make sure you signed in once so the `admin` claim is
  set, and that `storage.rules` are deployed.
