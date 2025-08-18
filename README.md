# CredoKaizen Static Portfolio – Self Hosting Guide (SiteGround, GoDaddy, cPanel & Similar Shared Hosts)

This guide walks a non-Node hosting user (SiteGround, GoDaddy, Bluehost, Namecheap, generic cPanel) through deploying the CredoKaizen static-exported Next.js site and keeping it updated over time—even though the host does not run a live Node.js server.

---

## 1. What You’re Deploying

You will deploy a folder of pre-built static assets generated from the project:

| Layer | Runtime on Shared Host | Where It Happens |
|-------|------------------------|------------------|
| Next.js (App Router) | Already baked into static HTML/JS | Locally / CI before upload |
| Prisma + MySQL (optional source DB) | NOT on host (unless you have a managed DB) | Local / CI only |
| Data Export (JSON) | Bundled into final build | Local / CI |
| Company Pages (/companies + /companies/[slug]) | Static HTML | Host |
| OpenGraph Images (/og/*.png) | Static PNGs | Host |
| Sitemap & robots.txt | Static files | Host |

No server-side code executes after you upload. Everything interactive is client-side JavaScript.

---

## 2. Deployment Modes (Choose One)

| Mode | When to Use | Steps |
|------|-------------|-------|
| A. Pure Static (recommended) | Shared hosting w/out Node support | Build locally → upload /out |
| B. Hybrid (Separate Admin) | You want dynamic editing elsewhere | Static site on shared host + admin app on Vercel |
| C. Full Node Hosting | ONLY if host provides full Node runtime (rare on shared) | Run `next start` (not covered here in depth) |

Most SiteGround / GoDaddy shared plans → Mode A.

---

## 3. Quick Start (If You Already Have Node Locally)

```bash
git clone https://github.com/YOUR_FORK/Credokaizen.git
cd Credokaizen

npm install
npm run export        # Builds static site into /out
```

**Optional:** If you want to use the legacy Prisma workflow:
```bash
cp .env.example .env.local
# Edit DATABASE_URL for your MySQL database
npm run prisma:push   # Only if using a DB
npm run seed          # Optional sample data
```

Upload the contents of `out/` (NOT the folder itself) into your hosting document root (often `public_html/`).

Done.

---

## 4. Local Environment Setup (Detailed)

1. Install Node.js ≥ 18 (LTS recommended).
2. Fork or clone the repository.
3. Run:
   ```bash
   npm install
   npm run export
   ```
4. Modify or add companies in `src/data/companies.json` (see Section 7).

**Optional Prisma Setup (Legacy):**
3. Install MySQL locally if you want to manage structured data via Prisma:
   - Create DB: `CREATE DATABASE credokaizen_dev CHARACTER SET utf8mb4;`
   - Set `.env.local` with `DATABASE_URL="mysql://user:pass@localhost:3306/credokaizen_dev"`
4. Run:
   ```bash
   npm run prisma:push
   npm run seed
   ```
5. Generate static data & dev server:
   ```bash
   npm run dev
   ```

---

## 5. Build & Export for Hosting

The single canonical command:
```bash
npm run export
```

Behind the scenes this runs (order may vary based on your package.json):
1. `validate:data` – Validates companies.json data structure and reports errors/warnings using tsx.
2. `generate:sitemap` – Creates `public/sitemap.xml` using tsx.
3. `generate:og` – Generates OpenGraph PNGs into `public/og/` using tsx.
4. `next build` – Builds production assets.
5. `next export` – Writes static site to `/out`.

Contents of `/out` are safe to host anywhere that serves static files.

---

## 6. Where to Upload Files on Common Hosts

| Host | Target Directory | Notes |
|------|------------------|-------|
| SiteGround | `public_html/` | Replace existing index.* if overwriting old site |
| GoDaddy (cPanel) | `public_html/` | Use File Manager or SFTP |
| Namecheap | `public_html/` | Same pattern |
| Plesk | `httpdocs/` | Equivalent root |
| DirectAdmin | `domains/yourdomain.com/public_html/` | Varies |

Upload ALL files from `/out` (index.html + subfolders). Do not include the `out` folder itself unless you want URLs like `/out/index.html`.

---

## 7. Updating Company / Product Data

**Current Approach: JSON-Only (Recommended)**

1. Open `src/data/companies.json`.
2. Add / modify company objects.
3. Save and run `npm run export`.

Pros: Simple, no DB required, fast workflow.
Cons: No schema validation beyond TypeScript hints and optional JSON Schema.

**JSON Schema Support:** A `companies.schema.json` file is available for editor validation in VS Code and other IDEs that support JSON Schema. This provides real-time validation and autocompletion when editing `companies.json`.

### Legacy Approach: Prisma + MySQL Workflow (Optional)

*Note: This approach is maintained for backwards compatibility but not required for the current workflow.*

1. Edit `prisma/schema.prisma` if you need new fields.
2. `npm run prisma:push` to sync local DB.
3. Add/update seed logic in `scripts/seed.ts` or manually use a DB client.
4. Run:
   ```bash
   npm run seed
   npm run generate:data
   npm run export
   ```
5. Commit the updated `src/data/companies.json`.

In both approaches, the export ensures per-company pages and OG images are updated.

---

## 8. Adding a New Company (JSON Example)

```json
{
  "id": 3,
  "slug": "phoenix-labs",
  "name": "Phoenix Labs",
  "tagline": "Reinventing compliance automation.",
  "shortDescription": "Lightweight compliance orchestration.",
  "longDescription": "Phoenix Labs builds tools...",
  "status": "INCUBATION",
  "websiteUrl": "https://example.com/phoenix",
  "logoUrl": "/logos/phoenix.svg",
  "primaryColor": "#F97316",
  "products": []
}
```

Important:
- `slug` must be unique.
- `status` must be one of: ACTIVE, INCUBATION, RETIRED, EXITED.
- Add a matching logo into `public/logos/` (optional).

---

## 9. Regenerating OpenGraph Images

The tsx script scans `src/data/companies.json` and outputs PNGs:
```
public/og/{slug}.png
```

To force regeneration:
```bash
rm -rf public/og/*.png
npm run generate:og
```

The script uses tsx for cross-platform execution and generates images with company branding. If a company has no tagline/shortDescription, the script uses fallback text.

---

## 10. SEO Artifacts

| File | Purpose | Generated? |
|------|---------|------------|
| `/sitemap.xml` | Search engine discovery | Yes (script) |
| `/robots.txt` | Crawl directives + sitemap link | Committed static |
| `/og/*.png` | Rich link previews | Generated |
| JSON-LD (Organization + Products) | Injected in `<head>` | In layout |
| JSON-LD (Company detail) | Per page script tag | In `[slug]/page.tsx` |

Make sure your live domain:
- Is referenced correctly in `robots.txt` and sitemap (edit if different from `https://credokaizen.com`).
- Has HTTPS (see Section 13).

---

## 11. Manual Upload Methods

### A. cPanel / Site Tools File Manager
1. Compress local `out/` contents into a zip (NOT the folder container).
2. Upload via File Manager.
3. Extract in `public_html/`.

### B. SFTP
Use a client (FileZilla / Cyberduck):
- Host: Provided by your provider
- User / Pass: Your SFTP credentials
- Remote path: `public_html`
- Upload all files inside `out/`.

### C. Git (If Host Supports)
Some hosts allow pulling from Git:
1. Push the built `out/` (or create a separate `deploy` branch containing only `/out` artifacts).
2. Use a post-receive hook to copy files:
   ```bash
   # pseudo-hook content
   rm -rf ~/public_html/*
   cp -R out/* ~/public_html/
   ```

---

## 12. Automating Deployment (Optional CI Outline)

You can use GitHub Actions + FTP deploy:

```yaml
# .github/workflows/deploy.yml
name: Deploy Static Site
on:
  push:
    branches: [ main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run export
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }} # Only if using Prisma data generation
      - name: Upload via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASS }}
          local-dir: out
          server-dir: public_html
```

Add secrets in GitHub repo settings. If you manually edit JSON and don’t use Prisma, you can omit `DATABASE_URL`.

---

## 13. Domain + HTTPS Checklist

1. Point DNS A record (and optionally AAAA for IPv6) to hosting IP.
2. Add CNAME for `www` → root domain (or vice versa).
3. Enable free SSL (Let’s Encrypt) in your hosting control panel.
4. Force HTTPS:
   - Most hosts: toggle “HTTPS Enforce”.
   - Or create `.htaccess` in root:
     ```
     RewriteEngine On
     RewriteCond %{HTTPS} !=on
     RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
     ```

---

## 14. Updating the Site

Workflow each time:

1. Pull latest repo changes.
2. Add/edit companies (JSON or DB+export).
3. Run `npm run export`.
4. Upload new `/out` contents (overwrite existing).
5. Clear host’s cache (if CDN/SG Optimizer enabled).

No need to delete older files unless assets were removed.

---

## 15. Optional: Separate Admin (Hybrid Mode)

If you need a secure editor interface:
1. Deploy an “admin” Next.js app on Vercel with next-auth and direct DB access.
2. Admin writes to the primary DB (e.g., PlanetScale / Railway).
3. A webhook (or manual trigger) runs the static export pipeline in GitHub Actions, then deploys fresh static assets to SiteGround.
4. Public site stays static and fast; editing experience remains dynamic elsewhere.

---

## 16. Security Guidelines

| Area | Recommendation |
|------|---------------|
| Secrets | Never commit real DB creds; only placeholders in `.env.example`. |
| DB Users | Grant least privilege (SELECT/INSERT/UPDATE only if using external DB). |
| Static Data | Sanitize sensitive internal notes before export. |
| OG Images | Don’t render confidential content; they become public. |
| GitHub Secrets | Restrict access; rotate if compromised. |

---

## 17. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank page after upload | Uploaded parent `out/` folder instead of contents | Move contents up one level |
| 404 on /companies/... | Export not rerun after data change | Run `npm run export` again |
| Old OG image in previews | Social cache | Use Facebook Debugger / Twitter Card Validator to refresh |
| Wrong domain in sitemap | Hard-coded base URL | Edit sitemap script or environment base constant |
| Styles not loading | Some hosts block `_next` directory or changed path | Ensure `_next/` folder is preserved exactly |
| Missing logos | Logo path incorrect | Place files in `public/logos/` and reference `/logos/name.svg` |

---

## 18. FAQ

Q: Can I host this on GitHub Pages instead?  
A: Yes—`/out` can be pushed to a `gh-pages` branch. Adjust sitemap domain accordingly.

Q: Do I need Prisma if I just edit JSON?  
A: No. Remove Prisma-related dependencies & scripts if you want a leaner setup.

Q: Can I add a blog?  
A: Yes—add MDX files under `content/` and build them into static pages at export time.

Q: How do I change site colors/theme?  
A: Update CSS variables in `src/app/globals.css` and re-export.

---

## 19. Minimal “I Just Want It Live” Checklist

1. Clone repo.
2. (Optional) Edit `src/data/companies.json`.
3. `npm install`
4. `npm run export`
5. Upload `/out/*` to `public_html/`
6. Verify: visit domain → check /companies and a detail page.
7. Test OG: share a company URL on Slack/Twitter.

Done.

---

## 20. Support / Next Enhancements

Potential next steps:
- Add blog & MDX pipeline
- Generate canonical tags + RSS feed
- Add dark/light toggle (prefers-color-scheme)
- Automate deployment with GitHub Actions
- Migrate images to a CDN (Cloudflare R2 / Bunny / S3)

---

Made for incremental improvement. If you encounter edge cases or want an automated CI deploy config tailored to your hosting provider, integrate Section 12 and adapt credentials.

Happy shipping! 🚀
