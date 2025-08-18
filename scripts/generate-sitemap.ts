#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';

interface Company {
  slug: string;
  name: string;
  status: string;
}

/**
 * Generate sitemap.xml for the static site
 */
function generateSitemap(): void {
  const cwd = process.cwd();
  const dataPath = resolve(cwd, 'src/data/companies.json');
  const outputPath = resolve(cwd, 'public/sitemap.xml');
  
  console.log('🗺️  Generating sitemap...');
  console.log(`Working directory: ${cwd}`);
  console.log(`Data source: ${dataPath}`);
  console.log(`Output: ${outputPath}`);

  // Ensure public directory exists
  const publicDir = dirname(outputPath);
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
    console.log(`✅ Created directory: ${publicDir}`);
  }

  // Read companies data
  let companies: Company[];
  try {
    if (!existsSync(dataPath)) {
      console.error(`❌ Companies data file not found: ${dataPath}`);
      process.exit(1);
    }

    const dataContent = readFileSync(dataPath, 'utf8');
    companies = JSON.parse(dataContent);
    console.log(`📊 Loaded ${companies.length} companies`);
  } catch (error) {
    console.error(`❌ Failed to read companies data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }

  // Get base URL from environment or use default
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://credokaizen.com';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Generate sitemap XML
  const sitemapEntries: string[] = [];

  // Add main pages
  sitemapEntries.push(`  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`);

  sitemapEntries.push(`  <url>
    <loc>${baseUrl}/companies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

  // Add company pages
  companies.forEach(company => {
    // Set priority based on status
    let priority = '0.7';
    if (company.status === 'ACTIVE') {
      priority = '0.9';
    } else if (company.status === 'INCUBATION') {
      priority = '0.8';
    }

    sitemapEntries.push(`  <url>
    <loc>${baseUrl}/companies/${company.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

  // Write sitemap file
  try {
    writeFileSync(outputPath, sitemapXml, 'utf8');
    console.log(`✅ Sitemap generated with ${sitemapEntries.length} URLs`);
    console.log(`📄 File saved to: ${outputPath}`);
    console.log(`🌐 Base URL: ${baseUrl}`);
  } catch (error) {
    console.error(`❌ Failed to write sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }

  console.log('🎉 Sitemap generation completed successfully!');
}

// Run sitemap generation
generateSitemap();