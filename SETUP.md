# Konfido Landing — Setup Steps

Step-by-step to get this app live at `usekonfido.com`. Follow in order.

---

## 1. Local development

```bash
npm install
cp .env.example .env.local
# (fill in values from steps 2–3 below before running)
npm run dev
# open http://localhost:3000
```

Forms will fail until Supabase is wired up — that's expected.

---

## 2. Supabase project (~10 min)

1. Sign up / log in at https://supabase.com/dashboard.
2. **New project**:
   - Name: `konfido-landing`
   - Region: **Frankfurt (eu-central-1)** for TR/EU latency
   - Database password: save it, you won't need it for the API but Supabase requires it
   - Pricing plan: Free
3. Wait ~1 min for the project to provision.
4. Settings → **API**:
   - Copy `Project URL` → this is `SUPABASE_URL` in `.env.local`
   - Copy `service_role` key (under "Project API keys") → this is `SUPABASE_SERVICE_ROLE_KEY`
   - **Never** commit the service role key.

### 2a. Create tables

SQL Editor → **New query** → paste, click Run:

```sql
-- Lead capture (customer / partner / investor share one table)
create table public.leads (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  form_type    text not null check (form_type in ('customer','partner','investor')),
  name         text not null,
  email        text not null,
  phone        text,
  company      text,
  fund         text,
  entities     text,
  partner_type text,
  stage        text,
  language     text,
  user_agent   text,
  ip_hash      text
);

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

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_form_type_idx  on public.leads (form_type);
create index wp_created_at_idx    on public.whitepaper_requests (created_at desc);

-- Lock down anon/auth access; service_role bypasses RLS for our API routes.
alter table public.leads               enable row level security;
alter table public.whitepaper_requests enable row level security;
```

### 2b. Create the whitepaper bucket

Storage → **New bucket**:
- Name: `whitepapers`
- Public: **off** (must be private — signed URLs gate access)

After compressing the PDF, upload it as `konfido-whitepaper-en.pdf`.

### 2c. View submissions

Table Editor → `leads` or `whitepaper_requests`. Sort by `created_at desc`. That's the v0 admin UI.

---

## 3. Local `.env.local`

```
SUPABASE_URL=<from step 2 settings → API>
SUPABASE_SERVICE_ROLE_KEY=<from step 2 settings → API>
WHITEPAPER_BUCKET=whitepapers
WHITEPAPER_OBJECT_EN=konfido-whitepaper-en.pdf
IP_HASH_SALT=<run `openssl rand -hex 32`>
```

Restart `npm run dev`. Submit each form once — verify rows appear in Supabase Table Editor.

---

## 4. Push to GitHub

```bash
git init
# .gitignore already excludes node_modules, .next, .env*, etc.
git add .
git commit -m "Initial commit: Next.js port of landing page"
gh repo create konfido-landing --private --source=. --push
# or create the repo manually at github.com and:
#   git remote add origin git@github.com:<you>/konfido-landing.git
#   git push -u origin main
```

You'll handle commits manually per your preference; the `gh repo create --push` line is just a one-shot setup option.

---

## 5. Deploy to Vercel

1. https://vercel.com/new → **Import Git Repository** → pick `konfido-landing`.
2. Framework preset auto-detects **Next.js**. Leave defaults.
3. **Environment Variables** — add all five from `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WHITEPAPER_BUCKET`
   - `WHITEPAPER_OBJECT_EN`
   - `IP_HASH_SALT`
4. Click **Deploy**. First deploy takes ~2 min.
5. Smoke test on the `*.vercel.app` URL: submit one of each form, verify rows in Supabase.

---

## 6. Custom domain `usekonfido.com`

1. Vercel project → **Settings → Domains**.
2. Add `usekonfido.com` and `www.usekonfido.com`.
3. At your DNS registrar:
   - Apex `usekonfido.com` → **A** record `76.76.21.21`
   - `www` → **CNAME** `cname.vercel-dns.com`
4. Vercel auto-issues Let's Encrypt SSL once DNS resolves (typically <5 min, up to 24h max).
5. Pick one canonical: in Vercel, set `usekonfido.com` as primary and let Vercel redirect `www` → apex (or the other way; matter of taste).

---

## 7. Post-deploy checks

- [ ] All three lead forms submit successfully on production
- [ ] Whitepaper modal returns a working signed URL (downloads the PDF)
- [ ] Both languages (EN/TR) render correctly
- [ ] Open in Safari and on mobile — original CSS uses `clamp()`/`mask-image`/grid heavily
- [ ] Lighthouse / PageSpeed check
- [ ] Verify Supabase free tier usage (Settings → Usage); leads table should grow but bucket stays under 1GB

---

## 8. v1 follow-ups (deferred)

- Email notifications on new lead → Resend free tier (3k/mo)
- Cloudflare Turnstile anti-spam
- TR-language whitepaper PDF
- Vercel Analytics (one click in dashboard, free)
- Per-IP rate limiting via Upstash Redis if abuse appears

---

## Troubleshooting

**Form returns 500 with "Server not configured":**
Either env vars are missing in Vercel or the Supabase service role key is wrong. Check Vercel → Project → Settings → Environment Variables.

**Whitepaper download fails after form submit:**
Check the bucket is named exactly `whitepapers` (lowercase, plural) and the object name matches `WHITEPAPER_OBJECT_EN`. Bucket must be **private** for signed URLs to work.

**Build fails on Vercel:**
Run `npm run build` locally first — it should mirror Vercel's build. The CSS regex/font/clamp features all work in Next 16 + Turbopack out of the box.

**`ip_hash` not populating:**
Vercel sets `x-forwarded-for` automatically. Locally, the API will store `null` for ip_hash — that's expected.
