# Credokaizen (Static Site)

A lightweight, fully static Next.js site that lists companies (or similar entities) defined in a single JSON file.  
Optimized for super-simple deployment on shared hosting (e.g. SiteGround) where you only need to upload static files (HTML/CSS/JS/images).

You do NOT need a database, Node running in production, or serverless functions.  
You build locally, then upload the generated files.

---

## 1. What You Get

- Static pages for each company (generated from `src/data/companies.json`)
- A homepage / listing (assuming existing Next.js pages/components already in the repo)
- A generated `sitemap.xml`
- Placeholder Open Graph (OG) artifacts (easy to later replace with real images)
- Simple validation script to catch bad data early

---

## 2. Requirements (Local Machine Only)

Install locally (your shared host does NOT have to run these):

- Node.js 20.x or 22.x (LTS preferred)
- npm (comes with Node)
- A text editor (VS Code recommended)
- (Optional) Git if you want version control (recommended)

SiteGround (shared hosting) will ONLY host the exported static files (in `out/`), not run Node.

---

## 3. One-Time Local Setup

Clone or download the repository:

```bash
git clone https://github.com/your-user/credokaizen.git
cd credokaizen
npm install
```

(If you downloaded a ZIP, just unzip and `cd` into the folder, then run `npm install`.)

---

## 4. Project Structure (Key Parts)

```
src/
  data/
    companies.json        # Your content
scripts/
  validate-data.cjs       # Data quality checks
  generate-sitemap.cjs
  generate-og.cjs
public/                   # Static assets served as-is
out/                      # (Created after export) FINAL FILES TO UPLOAD
README.md
package.json
```

---

## 5. Editing Content

Open `src/data/companies.json`.  
It is a JSON array; each object example:

```json
{
  "id": 1,
  "slug": "acme-corp",
  "name": "Acme Corp",
  "status": "ACTIVE",
  "tagline": "Making rockets safer",
  "shortDescription": "We build reliable rocket components.",
  "website": "https://acme.example"
}
```

Rules (enforced by validator):
- id: unique non-negative integer
- slug: unique, non-empty string (used in page URL)
- name: required
- status: one of ACTIVE, INCUBATION, RETIRED, EXITED
Warnings only (optional fields): tagline, shortDescription, website

(Optional) JSON Schema assistance: if `companies.schema.json` exists in repo, VS Code will auto-suggest if you add at top of `companies.json`:
```json
{
  "$schema": "../companies.schema.json",
  ...
}
```
(Or configure in your editor settings.) If you don’t see suggestions, that’s okay—schema is optional.

---

## 6. Validating Data

Run:
```bash
npm run validate:data
```

Outcome:
- On errors: process exits with code 1 and you must fix them.
- On warnings: shows warnings but continues.

---

## 7. Generating Sitemap & OG Placeholders (Individually)

```bash
npm run generate:sitemap
npm run generate:og
```

These are normally executed automatically in the export pipeline (next section).

---

## 8. Build & Export (Create Static Site)

This single command does validation → sitemap → OG placeholders → Next.js build → export:

```bash
npm run export
```

Result: `out/` directory created (or refreshed).  
Everything inside `out/` is what you deploy to SiteGround (or any static host).

---

## 9. Deploy to SiteGround (Shared Hosting)

You have two easy deployment options:

### Option A: Manual Upload (Fastest to get running)

1. Run locally: `npm run export`
2. Open the `out/` folder.
3. Connect to SiteGround via:
   - Site Tools -> File Manager, OR
   - SFTP (recommended for many files)
4. Decide where site lives:
   - Root domain: upload contents of `out/` into `public_html/`
   - Subdomain (e.g. `new.example.com`): upload into its document root folder (SiteGround creates a separate folder for the subdomain)
   - Subdirectory (e.g. `example.com/credokaizen`): create `public_html/credokaizen/` and upload there (see “Subdirectory Note” below).
5. Ensure an `index.html` is at that document root.
6. Load in browser. Done.

Subdirectory Note: If you deploy under a sub-path (like `/credokaizen`), you may need to configure Next.js `basePath` and/or `assetPrefix` before exporting. If you only deploy at root or on a subdomain, no extra config is needed. (Ask later if you want a sub-path guide.)

### Option B: Git (SiteGround Git Tool)

1. Initialize a Git repo on SiteGround (Site Tools -> Devs -> Git).
2. Push your repository there.
3. IMPORTANT: You still need the compiled static files. Easiest pattern:
   - Keep a separate branch that includes the built `out/` folder committed (e.g. `deploy` branch).
   - Locally: `npm run export`, then commit the `out/` contents to `deploy`.
   - Push `deploy` -> SiteGround deploys those static files.
4. Alternatively set up a GitHub Action that builds and then rsyncs or SFTPs only `out/` (ask if you want a workflow file).

For most users, Option A (manual upload) is simplest.

---

## 10. Updating the Site (Content Change Workflow)

1. Edit `src/data/companies.json`
2. Run `npm run validate:data`
3. Run `npm run export`
4. Upload new `out/` contents (you can delete old files first to avoid stale assets—EXCEPT keep any custom files you manually added directly on the server)
5. Refresh browser (hard refresh / clear CDN cache if using SG Optimizer caching)

---

## 11. Environment Variables (Optional)

`SITE_URL` (used in sitemap generation).  
Set before export:

```bash
export SITE_URL="https://yourdomain.com"  # macOS/Linux
# or on Windows PowerShell:
$env:SITE_URL="https://yourdomain.com"
npm run export
```

If not set, sitemap falls back to `https://example.com` (remember to change it!).

---

## 12. Open Graph (OG) Placeholders

Current `generate-og` script writes simple placeholder files in `public/og/`.  
You can later replace with real image generation (e.g. using `satori` + `@resvg/resvg-js`).  
If you already have real OG image generation in code, keep using it—placeholders are safe.

---

## 13. Common Tasks Cheat Sheet

| Task | Command |
|------|---------|
| Install deps | npm install |
| Validate data | npm run validate:data |
| Generate sitemap only | npm run generate:sitemap |
| Generate OG placeholders only | npm run generate:og |
| Full static export | npm run export |
| Clean build (optional) | rm -rf .next out |

---

## 14. Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Validation fails | Duplicate id/slug or missing required fields | Fix JSON then re-run |
| EROFS or read-only errors | (Previously with tsx) Not applicable now | Already solved by plain JS scripts |
| 404 on company pages after upload | Possibly missing files or uploaded to wrong folder | Confirm `out/companies/<slug>/index.html` exists and is in correct path |
| Wrong domain in sitemap | `SITE_URL` not set | Export again with correct env var |
| Stale content after redeploy | Browser or SG cache | Clear cache / hard reload |
| No styles or broken assets | Partial upload or wrong relative paths | Re-upload entire `out/` folder contents |

---

## 15. Optional Enhancements (Ask if You Want Them)

- GitHub Action to auto-build & deploy via SFTP
- Real OG image rendering
- CI validation on pull requests
- Search / filtering UI for companies
- Incremental content editing UI (non-tech contributor dashboard)

---

## 16. FAQs

Q: Can I edit files directly on SiteGround?  
A: You can, but you’ll lose changes when you next upload a fresh `out/`. Always treat `out/` as disposable build output.

Q: Do I need to upload the `scripts/` folder or source code?  
A: No. Only the contents of `out/` are required for the live site.

Q: Can I use a Windows machine?  
A: Yes. Use PowerShell or Git Bash. Replace `rm -rf` with manual deletion or `rmdir /s /q`.

---

## 17. Quick Start (Copy/Paste)

```bash
git clone https://github.com/your-user/credokaizen.git
cd credokaizen
npm install
# Edit src/data/companies.json as needed
npm run validate:data
export SITE_URL="https://yourdomain.com"    # (set base URL, optional but recommended)
npm run export
# Upload ./out/** to your SiteGround public_html/
```

Done!

---

## 18. License

(If you have a license file, reference it here. Otherwise decide a license—MIT is common.)

---

## 19. Need More Help?

Just open an issue or ask for:
- Deployment automation
- Subdirectory path configuration
- Improving performance & lighthouse metrics

Happy shipping! 🚀
