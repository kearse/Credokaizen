# CredoKaizen Static Portfolio – Self Hosting Guide (SiteGround, GoDaddy, cPanel & Similar Shared Hosts)

A Next.js-based static portfolio website for showcasing companies and products. This guide focuses on deploying a pre-built static site to shared hosting providers.

---

## 1. What You're Deploying

You will deploy a folder of pre-built static assets generated from the project:

| Layer | Runtime on Shared Host | Where It Happens |
|-------|------------------------|------------------|
| Next.js (App Router) | Already baked into static HTML/JS | Locally / CI before upload |
| Data (JSON) | Bundled into final build | Local / CI |
| Company Pages (/companies + /companies/[slug]) | Static HTML | Host |
| OpenGraph Images (/og/*.png) | Static PNGs | Host |
| Sitemap & robots.txt | Static files | Host |

No server-side code executes after you upload. Everything interactive is client-side JavaScript.

---

## 2. Prerequisites

- Node.js ≥ 18 (LTS recommended)
- Basic familiarity with JSON editing
- Access to your hosting provider's file manager or FTP

---

## 3. Quick Start (If You Already Have Node Locally)

```bash
git clone https://github.com/YOUR_FORK/Credokaizen.git
cd Credokaizen

npm install
npm run export        # Builds static site into /out
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
4. Start local development (optional):
   ```bash
   npm run dev
   ```
5. Edit companies data (see Section 7).

---

## 5. Hosting Provider Setup

### 5.1. SiteGround

1. **Log into cPanel** or SiteGround hosting dashboard.
2. **Open File Manager** → Navigate to `public_html/` (or your domain's document root).
3. **Upload** the contents of `/out` (drag files directly, not the folder).
4. **Set permissions** if needed (usually 644 for files, 755 for directories).
5. **Clear cache** from SiteGround Tools → Speed → Caching if using SG Optimizer.

### 5.2. GoDaddy / Other cPanel Hosts

Similar process:
1. **cPanel File Manager** → `public_html/`
2. **Upload /out contents**
3. **Test your site** at `yourdomain.com`

---

## 6. File Structure Overview

```
/out                     # Generated static files (upload this)
├── _next/               # Next.js runtime assets
├── companies/           # Company detail pages
├── og/                  # OpenGraph images
├── index.html           # Homepage
├── sitemap.xml          # SEO sitemap
└── robots.txt           # Crawler directives
```

---

## 7. Updating Company / Product Data

### Manual JSON Editing Workflow

1. **Edit the data file**: Open `src/data/companies.json`.
2. **Add/modify company objects** following the structure below.
3. **Validate and build**:
   ```bash
   npm run export        # Validates data, generates assets, builds static site
   ```
4. **Upload** the new `/out` contents to your host.

### Example Company Entry

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

**Important:**
- `slug` must be unique (used for URLs).
- `status` must be one of: `ACTIVE`, `INCUBATION`, `RETIRED`, `EXITED`.
- Add matching logos to `public/logos/` (optional).

### Data Validation

The export process automatically validates your data:
- **Required fields**: `id`, `slug`, `name`, `status`
- **Unique constraints**: `slug` and `id` must be unique
- **Format validation**: Status values, URL formats, etc.

If validation fails, the export will stop with helpful error messages.

---

## 8. Manual Validation (Optional)

To check your data without building:

```bash
npm run validate:data
```

---

## 9. Regenerating OpenGraph Images

The script scans `src/data/companies.json` and outputs PNGs:
```
public/og/{slug}.png
```

To force regeneration:
```bash
rm -rf public/og/*.png
npm run generate:og
```

If a company has no tagline/shortDescription, script uses fallback text.

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

## 11. Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build static site (no validation) |
| `npm run export` | Full pipeline: validate → sitemap → OG → build |
| `npm run validate:data` | Validate companies.json only |
| `npm run generate:sitemap` | Generate sitemap.xml |
| `npm run generate:og` | Generate OpenGraph images |

---

## 12. Automating Deployment (Optional CI Outline)

Sample GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run export
      - name: Deploy to FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASS }}
          local-dir: out/
```

Add secrets in GitHub repo settings.

---

## 13. SSL / HTTPS Setup

Most shared hosts offer free SSL certificates:

- **SiteGround**: Let's Encrypt SSL in cPanel → Security → SSL Manager
- **GoDaddy**: SSL Certificates in hosting dashboard
- **Others**: Look for "SSL" or "Security" in cPanel

Once enabled, update any hardcoded HTTP references to HTTPS.

---

## 14. Updating the Site

Workflow each time:

1. Pull latest repo changes.
2. Edit companies data in `src/data/companies.json`.
3. Run `npm run export`.
4. Upload new `/out` contents (overwrite existing).
5. Clear host's cache (if CDN/SG Optimizer enabled).

No need to delete older files unless assets were removed.

---

## 15. Optional: Separate Admin (Hybrid Mode)

If you need a secure editor interface:
1. Deploy an "admin" Next.js app on Vercel with next-auth and direct data editing.
2. Admin writes to a central data source (e.g., GitHub API, headless CMS).
3. A webhook (or manual trigger) runs the static export pipeline in GitHub Actions, then deploys fresh static assets to your shared host.
4. Public site stays static and fast; editing experience remains dynamic elsewhere.

---

## 16. Security Guidelines

| Area | Recommendation |
|------|---------------|
| Secrets | Never commit sensitive data; use environment variables for CI/CD. |
| Static Data | Sanitize sensitive internal notes before publishing. |
| OG Images | Don't render confidential content; they become public. |
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
| Validation errors | Invalid data in companies.json | Check error messages and fix required fields |

---

## 18. FAQ

Q: Can I host this on GitHub Pages instead?  
A: Yes—`/out` can be pushed to a `gh-pages` branch. Adjust sitemap domain accordingly.

Q: How do I add a blog?  
A: Add MDX files under `content/` and build them into static pages at export time.

Q: How do I change site colors/theme?  
A: Update CSS variables in `src/app/globals.css` and re-export.

Q: Can I use a CMS instead of manual JSON editing?  
A: Yes—replace the data reading functions in `src/lib/data.ts` to fetch from a headless CMS API during build time.

---

## 19. Minimal "I Just Want It Live" Checklist

✅ Node.js installed  
✅ Repository cloned  
✅ `npm install`  
✅ Edit `src/data/companies.json` (optional)  
✅ `npm run export`  
✅ Upload `/out/*` to `public_html/`  
✅ Check `yourdomain.com`

---

## 20. Support / Next Enhancements

For issues or feature requests, open a GitHub issue or discussion.

Potential enhancements:
- Rich text editor for company descriptions
- Image upload/management workflow  
- Analytics integration
- Multi-language support
- Advanced OG image templates

---

## Data Validation Rules

The validation script checks:

### Required Fields
- `id` (number, unique)
- `slug` (string, unique, lowercase alphanumeric + hyphens)
- `name` (string, non-empty)
- `status` (enum: ACTIVE, INCUBATION, RETIRED, EXITED)

### Optional Fields
- `tagline`, `shortDescription`, `longDescription` (strings)
- `websiteUrl` (valid HTTP/HTTPS URL)
- `logoUrl` (string, typically `/logos/filename.ext`)
- `primaryColor` (hex color, e.g., `#FF0000`)
- `products` (array of product objects)

### Product Fields
- `id` (number, required)
- `name` (string, required)
- `description` (string, required)
- `url` (valid HTTP/HTTPS URL, optional)

---

This completes your CredoKaizen static portfolio setup. The site now operates entirely on manual JSON editing with built-in validation and static generation—no database required.