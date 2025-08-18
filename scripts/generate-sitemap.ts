const fs = require('fs');
const path = require('path');

function generateSitemap() {
  const companiesPath = path.join(process.cwd(), 'src/data/companies.json');
  const publicPath = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicPath, 'sitemap.xml');

  // Ensure public directory exists
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  let companies: any[] = [];
  if (fs.existsSync(companiesPath)) {
    try {
      const content = fs.readFileSync(companiesPath, 'utf-8');
      companies = JSON.parse(content);
    } catch (error) {
      console.error('Error reading companies.json:', error);
      process.exit(1);
    }
  }

  const baseUrl = 'https://credokaizen.com'; // Update this to your actual domain
  const currentDate = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/companies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  companies.forEach(company => {
    sitemap += `
  <url>
    <loc>${baseUrl}/companies/${company.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Generated sitemap.xml with ${companies.length + 2} URLs`);
}

generateSitemap();