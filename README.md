# CredoKaizen Website

A modern, animated portfolio / venture studio site showcasing the products, programs, and companies we build and launch. Features fully static export capabilities with pre-generated OpenGraph images, sitemap, and SEO optimization.

## ✨ Stack

- **Next.js (App Router) + React + TypeScript** - Modern React framework with static export
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Framer Motion** - High-quality animations and interactions
- **Satori + @resvg/resvg-js** - Pre-generated OpenGraph images
- **Static Export** - Fully static site deployment compatible with SiteGround

## 🚀 Getting Started

```bash
git clone git@github.com:kearse/Credokaizen.git
cd Credokaizen
npm install
npm run dev
```

Visit: http://localhost:3000

## 📁 Site Structure

### Routes
- `/` - Homepage with hero, featured companies, and about section
- `/companies` - Full portfolio with filtering (by status and category)
- `/companies/[slug]` - Individual company detail pages with rich metadata
- Custom 404 page for better user experience

### Features
- **Dynamic Filtering** - Filter companies by status (Active, Incubation, Exited) and category
- **SEO Optimized** - JSON-LD structured data, OpenGraph meta tags, sitemap
- **Pre-generated OG Images** - Unique OpenGraph images for each company page
- **Fully Static** - No runtime dependencies, perfect for static hosting
- **Responsive Design** - Mobile-first approach with smooth animations
- **Accessibility** - Focus states, semantic HTML, proper ARIA attributes

## 🛠 Build & Export Process

The site uses a multi-step build process to generate all static assets:

```bash
# Full static export pipeline
npm run export

# Individual steps
npm run generate:data      # Placeholder for future data generation
npm run generate:sitemap   # Creates sitemap.xml with all routes
npm run generate:og        # Generates OpenGraph images for all companies
npm run build             # Next.js build with static export
```

### Generated Assets
- **Sitemap** - `/sitemap.xml` with all pages and proper metadata
- **Robots.txt** - SEO directives and sitemap reference
- **OpenGraph Images** - Pre-generated `/og/{slug}.png` for each company
- **Static HTML** - All pages pre-rendered in `/out` directory

## 🗂 Content Management

### Company Data
Companies are defined in `src/data/companies.json` with the following structure:

```json
{
  "id": "unique-id",
  "name": "Company Name",
  "slug": "url-slug",
  "shortDescription": "Brief description for cards",
  "tagline": "Optional tagline",
  "description": "Full description for detail pages",
  "status": "active|incubation|exited",
  "category": "Industry Category",
  "foundedYear": 2023,
  "website": "https://company.com",
  "featured": true
}
```

### Adding New Companies
1. Add company data to `src/data/companies.json`
2. Run `npm run export` to regenerate sitemap and OG images
3. Deploy the updated `/out` directory

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in real values. Never commit `.env.local`.

```
cp .env.example .env.local
```

## 🚀 Deployment

The site generates a fully static export in the `/out` directory:

```bash
npm run export
```

Deploy the contents of `/out` to any static hosting provider:
- **SiteGround** - Upload `/out` contents to public_html
- **Netlify** - Drag and drop `/out` folder
- **Vercel** - Connect GitHub repo with `output: 'export'` in next.config.mjs
- **GitHub Pages** - Deploy `/out` contents to gh-pages branch

### Important Notes
- All OpenGraph images are pre-generated and committed to the repository
- No server-side runtime required - pure static files
- Sitemap automatically updates when companies are added/removed
- All meta tags and structured data are pre-rendered

## 🧪 Development Notes

- **Animations** - Framer Motion used throughout for smooth interactions
- **Styling** - Tailwind with custom CSS variables in `globals.css`
- **Components** - Reusable components in `src/components/`
- **Data Layer** - Helper functions in `src/lib/data.ts`
- **Scripts** - Build-time generation scripts in `scripts/`

## 🛡 Security / Secrets

- Real credentials belong only in `.env.local` or deployment secrets
- NEVER commit production secrets
- All generated assets are safe for public distribution
- OpenGraph images contain no sensitive information

## 📦 Future Enhancements

- **Enhanced OG Images** - Implement proper SVG to PNG conversion with custom fonts
- **CMS Integration** - Connect to headless CMS for dynamic content management
- **Advanced Filtering** - Add search, date ranges, and more filter options
- **Analytics** - Add privacy-focused analytics tracking
- **Dark Mode** - Implement dark/light theme switching
- **Performance** - Add service worker for offline functionality

## 🔧 Technical Implementation

### Static Generation
- Uses Next.js App Router with `output: 'export'`
- Pre-generates all possible routes at build time
- Implements `generateStaticParams` for dynamic routes

### SEO & Metadata
- Global Organization JSON-LD in layout
- Per-company SoftwareApplication JSON-LD
- Dynamic OpenGraph metadata for each page
- Proper sitemap.xml generation

### OpenGraph Images
- Pre-generated at build time using placeholder system
- Unique design for each company with branding
- Fallback system for companies without custom taglines
- Future-ready for enhanced image generation

---

Made with continuous improvement in mind (Kaizen). Let’s build iteratively. 🚧