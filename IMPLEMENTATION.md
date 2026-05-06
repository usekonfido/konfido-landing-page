# Konfido Landing — Implementation Plan (v0)

Convert the current `index.html` into a Next.js app on Vercel with two working
forms (3-path lead form + gated whitepaper download) backed by Supabase.

## Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Hosting**: Vercel Hobby (free)
- **Database**: Supabase Postgres (free tier, 500MB)
- **File storage**: Supabase Storage (free tier, 1GB) — holds the gated PDF
- **Spam**: Cloudflare Turnstile (free, optional for v0)
- **Email notifications**: deferred to v1 (Resend)

Total cost: **$0/mo**.

---

## 1. Repo layout

```
konfido-landing-page/
├── app/
│   ├── layout.tsx                  # <html>, fonts, language provider
│   ├── page.tsx                    # composes the sections
│   ├── globals.css                 # ported verbatim from <style> block
│   └── api/
│       ├── leads/route.ts          # POST → insert lead
│       └── whitepaper/route.ts     # POST → insert request, return signed URL
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Problems.tsx
│   ├── Pipeline.tsx
│   ├── Stops.tsx
│   ├── Steps.tsx
│   ├── Whitepaper.tsx              # gated download button + modal
│   ├── WhitepaperModal.tsx
│   ├── LeadForms.tsx               # 3-tab form (customer/partner/investor)
│   ├── Footer.tsx
│   └── i18n/
│       ├── LanguageProvider.tsx    # EN/TR context
│       └── useT.ts                 # t(en, tr) helper
├── lib/
│   ├── supabase-server.ts          # service-role client (server only)
│   └── schemas.ts                  # zod schemas for both endpoints
├── public/
│   └── (favicon, og image, logo svg if extracted)
├── .env.local                      # gitignored
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

`index.html` stays in the repo until parity is verified, then deleted.

---

## 2. Supabase setup

1. Create project at https://supabase.com/dashboard → free tier, region `eu-central-1` (Frankfurt) for TR/EU latency.
2. Save these from project settings → API:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never ship to client)
   - `anon` key → not needed for v0, all writes go through API routes

### Schema (run in SQL editor)

```sql
-- Lead capture (customer / partner / investor share one table)
create table public.leads (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  form_type    text not null check (form_type in ('customer','partner','investor')),
  name         text not null,
  email        text not null,
  phone        text,
  company      text,           -- customer/partner
  fund         text,           -- investor
  entities     text,           -- customer
  partner_type text,           -- partner
  stage        text,           -- investor
  language     text,           -- 'en' | 'tr'
  user_agent   text,
  ip_hash      text            -- sha256(ip + daily_salt) for light dedupe, no PII
);

-- Whitepaper download requests
create table public.whitepaper_requests (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  language    text,
  user_agent  text,
  ip_hash     text
);

-- Helpful indexes
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_form_type_idx  on public.leads (form_type);
create index wp_created_at_idx    on public.whitepaper_requests (created_at desc);

-- RLS: deny all from client; service_role bypasses RLS so API routes still work
alter table public.leads                 enable row level security;
alter table public.whitepaper_requests   enable row level security;
-- (no policies = no anon/auth access; service_role bypasses)
```

### Storage setup

1. Storage → New bucket → name `whitepapers`, **Private** (uncheck public).
2. Upload `konfido-whitepaper-en.pdf` (and `-tr.pdf` if applicable).
3. The API route generates a 15-minute signed URL on demand — file is never directly reachable.

### Viewing submissions

Supabase Dashboard → Table Editor → `leads` / `whitepaper_requests`. Sort by
`created_at desc`. That's the v0 admin UI.

---

## 3. Environment variables

`.env.local` (and Vercel project settings → Environment Variables):

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...    # server-only
WHITEPAPER_BUCKET=whitepapers
WHITEPAPER_OBJECT_EN=konfido-whitepaper-en.pdf
IP_HASH_SALT=<32+ random chars, rotate yearly>
```

For v0 the TR users get the EN PDF (no translated version exists yet). Add `WHITEPAPER_OBJECT_TR` later when a TR version is produced.

`.env.example` ships in repo with placeholders. `.env.local` is gitignored.

---

## 4. API routes

Both routes:
- run on Node runtime (default), not Edge — Supabase service-role client works on both, Node is fine.
- validate with `zod`.
- hash IP with daily salt for soft dedupe; never store raw IP.
- return JSON `{ ok: true }` or `{ ok: false, error }` with appropriate status.

### `app/api/leads/route.ts`

Accepts:
```ts
{
  form_type: 'customer' | 'partner' | 'investor',
  name: string,
  email: string,
  phone?: string,
  company?: string,
  fund?: string,
  entities?: '1' | '2-5' | '6-15' | '16+',
  partner_type?: 'erp' | 'bank' | 'distribution' | 'advisory' | 'other',
  stage?: 'angel' | 'seed' | 'series_a' | 'exploring',
  language?: 'en' | 'tr'
}
```

Per-form-type required fields enforced via discriminated union in zod.

### `app/api/whitepaper/route.ts`

Accepts:
```ts
{ name: string, email: string, company?: string, language?: 'en' | 'tr' }
```

Flow:
1. Validate.
2. Insert into `whitepaper_requests`.
3. `supabase.storage.from('whitepapers').createSignedUrl(objectName, 60 * 15)`.
4. Return `{ ok: true, url }`.
5. Client opens `url` in a new tab.

### Rate limiting (v0)

Skip dedicated rate limiting. Rely on:
- Turnstile token check (if added)
- IP-hash uniqueness check: reject if same `ip_hash + email` submitted within last 60 seconds

For v1: Upstash Redis free tier + sliding window.

---

## 5. Frontend port — what to convert and how

The current `index.html` is well-structured; the port is mostly mechanical.

### CSS

- Move the entire `<style>` block to `app/globals.css` unchanged.
- Keep CSS variables and class names — components use them as-is.

### i18n

Replace the `data-i18n-en` / `data-i18n-tr` + CSS-based switch with:

```tsx
// LanguageProvider exposes { lang, setLang }
const { lang } = useLanguage();
const t = (en: string, tr: string) => (lang === 'tr' ? tr : en);
```

Persist choice in `localStorage` and `<html lang>`. Default: detect browser, fall back to `en`.

### Components — what each holds

- **Nav**: brand, links, language toggle, "Join waitlist" CTA scrolling to forms section.
- **Hero**: headline, lede, two CTAs (waitlist + read whitepaper, where the second now opens the gated modal).
- **Problems / Pipeline / Stops / Steps**: pure markup ports, no state.
- **Whitepaper**: section + "Download whitepaper" button → opens `WhitepaperModal`.
- **WhitepaperModal**: name/email/company → POST `/api/whitepaper` → on success `window.open(url, '_blank')` and show "Sent. Opening now…".
- **LeadForms**: tab picker (customer/partner/investor) + three forms sharing a single `onSubmit` posting `{ form_type, ...fields }` to `/api/leads`. On success swap to the existing success card.
- **Footer**: as-is.

### State strategy

Use `useState` per form. No global state library. Submission: `fetch('/api/...', { method: 'POST', body: JSON.stringify(data) })`. On success → set `submitted=true`. On error → inline error message under submit button.

### Smooth scroll & hash links

Keep `html { scroll-behavior: smooth }` in CSS. Anchor links (`#waitlist`, `#whitepaper`) work via Next.js out of the box.

### SEO / metadata

In `app/layout.tsx` use Next's `Metadata` API for title / description / OG. Reuse the values from current `<head>`.

---

## 6. Step-by-step build order

Each step ends in a runnable, deployable state.

1. **Scaffold** — `npx create-next-app@latest konfido-landing --ts --app --no-tailwind --eslint`. Push to GitHub. Connect to Vercel. Confirm hello-world deploys.
2. **CSS + static port** — port `<style>` to `globals.css`, hardcode all sections as static React (no i18n, no forms yet). Verify visual parity at desktop + mobile breakpoints.
3. **i18n** — add `LanguageProvider`, refactor visible strings to `t(en, tr)`, wire toggle in nav.
4. **Supabase project** — create, run schema, create bucket, upload PDF, copy keys to `.env.local`.
5. **API routes** — implement `/api/leads` and `/api/whitepaper` with zod validation. Test with `curl`.
6. **LeadForms component** — wire to `/api/leads`, success/error states.
7. **Whitepaper modal** — wire to `/api/whitepaper`, opens signed URL in new tab.
8. **Vercel env vars** — add all 5, redeploy, test forms on `*.vercel.app`.
9. **Custom domain (`usekonfido.com`)** — Vercel project → Settings → Domains → add `usekonfido.com` and `www.usekonfido.com`. At your registrar set DNS:
   - Apex `usekonfido.com` → A record `76.76.21.21`
   - `www` → CNAME `cname.vercel-dns.com`
   Vercel auto-issues Let's Encrypt SSL once DNS resolves (typically <5 min, can be up to 24h). Set `usekonfido.com` as primary, redirect `www` → apex (or vice versa, your call).
10. **Smoke test** — submit one of each form on prod, verify rows in Supabase Table Editor.

Estimated time: **6–10 focused hours** end to end.

---

## 7. Out of scope for v0 (deferred)

- Email notification on new lead (Resend) — v1.
- Admin dashboard — Supabase Table Editor is enough for v0.
- Per-language whitepaper variants — single PDF v0 if only EN exists.
- Cloudflare Turnstile — add if spam appears.
- Analytics — add Vercel Analytics (1 click, free) once live.
- A/B testing, consent banner (GDPR cookie banner) — only if/when needed.

---

## 8. Confirmed inputs

- **Whitepaper PDF**: EN-only, user will compress and upload to Supabase Storage before step 8 (Vercel env wire-up). TR users get the EN PDF for v0.
- **Domain**: `usekonfido.com` (apex + `www`).
- **Success copy**: keep current "We'll be in touch within 48 hours. The whitepaper is the best read in the meantime." (verbatim from `index.html:1321`).

---

## 9. Risk notes

- **Service role key leakage**: never import `lib/supabase-server.ts` from a client component. Rule of thumb: any file using `SUPABASE_SERVICE_ROLE_KEY` must live under `app/api/**` or be marked with no client imports.
- **Signed URL leakage**: 15-minute expiry limits damage; if a user shares the URL, anyone clicking within 15 min gets the file. Acceptable for a whitepaper.
- **CSS regressions**: the original CSS uses `clamp()`, `mask-image`, and grid heavily — verify in Safari and on mobile after the port.
- **Form spam**: monitor for the first week; add Turnstile if junk volume >5/day.
