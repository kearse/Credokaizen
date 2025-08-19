#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generates sitemap.xml from companies.json data
 */

function generateSitemap() {
  const dataPath = path.join(process.cwd(), 'src/data/companies.json');
  const outputPath = path.join(process.cwd(), 'public/sitemap.xml');
  
  // Ensure public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Get base URL from environment or use fallback
  const baseUrl = process.env.SITE_URL || 'https://example.com';
  
  // Read companies data
  let companies;
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    companies = JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading companies.json:', error.message);
    process.exit(1);
  }

  if (!Array.isArray(companies)) {
    console.error('Error: companies.json must contain an array');
    process.exit(1);
  }

  // Generate current timestamp in ISO format
  const now = new Date().toISOString();

  // Build sitemap XML
  const urls = [
    // Homepage
    {
      loc: baseUrl,
      lastmod: now,
      changefreq: 'weekly',
      priority: '1.0'
    },
    // Companies index page  
    {
      loc: `${baseUrl}/companies`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8'
    },
    // Individual company pages
    ...companies.map(company => ({
      loc: `${baseUrl}/companies/${company.slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.6'
    }))
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap file
  try {
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    console.log(`✅ Sitemap generated successfully: ${outputPath}`);
    console.log(`   Generated ${urls.length} URLs`);
    console.log(`   Base URL: ${baseUrl}`);
  } catch (error) {
    console.error('Error writing sitemap.xml:', error.message);
    process.exit(1);
  }
}

// Run sitemap generation
generateSitemap();