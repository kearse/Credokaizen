#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { getCompanies } from '../src/lib/data';

const BASE_URL = 'https://credokaizen.com';

function generateSitemap() {
  const companies = getCompanies();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/companies</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${companies
  .map(
    (company) => `  <url>
    <loc>${BASE_URL}/companies/${company.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log(`✅ Sitemap generated at ${outputPath}`);
  console.log(`📊 Included ${companies.length + 2} pages`);
}

if (require.main === module) {
  generateSitemap();
}

export { generateSitemap };