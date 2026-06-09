# Backlog

Deferred work for `avianna.ai`. Not in priority order — pull the right one when the moment fits.

## Migrate hosting to Cloudflare Pages (with Cloudflare DNS)

**Why:** Cloudflare Pages gives unlimited bandwidth/requests, edge functions (forms, redirects with logic, basic APIs without a backend), preview deploys per branch, free Web Analytics, and unlocks the Workers/KV/R2/D1 free tiers — all free, with the same `git push origin main` workflow as today. Today we're on GitHub Pages with DNS on GoDaddy.

**Prerequisites the user has to do (Claude can't):**

- Sign in / create Cloudflare account.
- Enter GoDaddy + Cloudflare passwords / 2FA codes when prompted.

**Rollout (≈ 20 min, zero downtime):**

### Phase 1 — DNS to Cloudflare
1. Cloudflare → **Add site** → `avianna.ai` (Free plan). Note the two assigned Cloudflare nameservers.
2. GoDaddy → Domain → Nameservers → change to the two Cloudflare nameservers. Save. (Propagation usually < 1 h.)
3. In Cloudflare, verify the imported records:
   - Apex A records → `185.199.108.153`, `.154`, `.155`, `.156` (GitHub Pages).
   - `www` CNAME → `tushar1344.github.io`.
   - Leave the cloud icons **gray (DNS-only)** during the transition so the GitHub Pages cert keeps working.

### Phase 2 — Cloudflare Pages project
4. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** → authorize GitHub → select `Tushar1344/avianna`.
5. Build config: **Framework preset = None**, **Build command = (empty)**, **Build output directory = `/`**, **Root directory = `/`**. **Save and Deploy**.
6. First build completes in ~30 s. Open the `*.pages.dev` preview URL and confirm the site renders.

### Phase 3 — Cut over the domain
7. Pages project → **Custom domains** → add `avianna.ai` (and `www.avianna.ai`). Cloudflare auto-rewires the records.
8. GitHub repo → **Settings → Pages** → clear the custom-domain field and save. (Releases the cert claim so Cloudflare Pages can provision its own; usually a few minutes.)

### Verify
- `curl -I https://avianna.ai/` → `server: cloudflare` (was `GitHub.com`).
- Browser hard-refresh; site renders identically.
- Pages dashboard shows the deploy as **Production**; subsequent `git push origin main` should trigger a new deploy automatically.

**What unlocks afterward (no extra cost):**
- Cloudflare Web Analytics (cookieless, drop-in script).
- Pages Functions for a real contact form (no third party needed).
- Page Rules / Transform Rules / Bulk Redirects.
- Workers, KV, R2, D1 free tiers when we want them.

---

_(Add more items below this line as they come up.)_
