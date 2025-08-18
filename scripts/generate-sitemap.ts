import fs from 'fs';
import path from 'path';
import { getAllCompanySlugs } from '../src/lib/data';

const baseUrl = 'https://credokaizen.com';

function generateSitemap() {
  const companySlugs = getAllCompanySlugs();
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    {
      url: '',
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: '1.0',
    },
    {
      url: '/companies',
      lastModified: currentDate,
      changeFreq: 'weekly',
      priority: '0.8',
    },
  ];

  const companyPages = companySlugs.map(slug => ({
    url: `/companies/${slug}`,
    lastModified: currentDate,
    changeFreq: 'monthly',
    priority: '0.7',
  }));

  const allPages = [...staticPages, ...companyPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);

  console.log(`✅ Sitemap generated with ${allPages.length} pages at ${sitemapPath}`);
}

// Run the script
try {
  generateSitemap();
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}