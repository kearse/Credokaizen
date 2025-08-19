const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'companies.json');
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

function generateSitemap() {
  console.log('🗺️  Generating sitemap...');
  
  try {
    const companies = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const baseUrl = process.env.SITE_URL || 'https://example.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    const urls = [
      {
        loc: baseUrl + '/',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '1.0'
      }
    ];
    
    // Add company pages
    companies.forEach(company => {
      urls.push({
        loc: `${baseUrl}/companies/${company.slug}/`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      });
    });
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    fs.writeFileSync(SITEMAP_PATH, sitemap);
    console.log(`✅ Sitemap generated with ${urls.length} URLs`);
    console.log(`   Base URL: ${baseUrl}`);
    console.log(`   Output: ${SITEMAP_PATH}`);
    
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error.message);
    process.exit(1);
  }
}

generateSitemap();