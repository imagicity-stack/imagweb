# Marketing-grade Blog Platform Architecture

This backend + admin UI rebuild adds structured SEO primitives, versioning, redirects, and sitemap automation while staying modular for future growth.

## File structure
- `src/lib/blog-engine/` – domain layer
  - `models.ts` – strongly typed models for posts, SEO, robots, and redirects.
  - `validation.ts` – centralized validation for titles, slugs, tags (4-8), alt text, schema type, robots controls, and excerpt/meta limits.
  - `readingTime.ts` – reading time estimator used before persisting.
  - `toc.ts` – auto-generates table of contents anchors from H2/H3 headings.
  - `sitemap.ts` – builds XML sitemap and writes to `public/sitemap.xml` whenever posts save.
  - `repository.ts` – Firestore gateway that maps inputs to persistence, manages versions, redirects, and sitemap refresh.
- `src/app/api/posts/` – Next.js App Router endpoints exposing JSON CRUD for posts.
- `src/components/blog-admin/PostForm.tsx` – modular form covering every content, SEO, and media control.
- `src/app/admin/posts/page.tsx` – sample admin surface that consumes the API endpoints and renders the PostForm.

## Domain model
- **Content core:** title (H1), slug with manual override, excerpt, HTML body (H2/H3/lists/embeds), featured image with required alt, single category, 4–8 tags, internal links, table-of-contents toggle, schema type (Article/BlogPosting/FAQ/HowTo), reading time, author, publish date, and status (Draft/Scheduled/Published/Private).
- **SEO:** SEO title (separate from H1) with counter, meta description with counter + snippet preview, canonical URL, robots index/follow options, Open Graph title/description/image with required alt text.
- **Governance:** version number with stored history, redirect builder that records old slugs as 301 rules, XML sitemap regeneration on save, and rollback helper.

## API endpoints
- `GET /api/posts` – list posts (for autocomplete, internal links, and admin cards).
- `POST /api/posts` – create a post with validation, reading-time + TOC computation, version seed, redirect tracking, and sitemap refresh.
- `GET /api/posts/:id` – fetch a post by id with SEO + robots metadata.
- `PUT /api/posts/:id` – update a post, append version history, add 301 redirect if slug changes, regenerate sitemap.

## Backend flows
1. **Validation:** `validatePostInput` enforces required fields, SEO lengths, robots choices, category+tag limits, alt text, and URL safety.
2. **Enrichment:** `mapInputToPayload` normalizes slug, tags, reading time, TOC, Open Graph defaults, and robots directives.
3. **Persistence:** `createPost` and `updatePost` write to Firestore, save a version snapshot, build redirect rules, and call sitemap regeneration.
4. **Sitemap:** `buildSitemapXml` renders published posts into XML and `writeSitemap` writes to `public/sitemap.xml` for search engines.
5. **Rollback:** `rollbackVersion` restores a saved payload into the main document and triggers sitemap refresh.

## Frontend surface
- **PostForm** groups content, media, taxonomy, SEO, robots, and governance controls; provides character counters, TOC + reading time feedback, tag limiter, internal link suggestions, and redirect visibility.
- **Admin page** (`/admin/posts`) wires the form to the API, shows save state, and lists versions with status, tags, and read-time context.

## Usage tips
- Set `NEXT_PUBLIC_SITE_URL` to ensure correct sitemap URLs.
- Provide compressed images and descriptive alt text; OG image alt is required to pass validation.
- Keep tags within 4–8 for SEO clustering; internal links are capped at five suggestions to stay purposeful.
