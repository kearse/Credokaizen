#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generates OpenGraph image placeholders for each company
 * Creates placeholder text files since we're avoiding complex image generation
 */

function generateOGImages() {
  const dataPath = path.join(process.cwd(), 'src/data/companies.json');
  const outputDir = path.join(process.cwd(), 'public/og');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

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

  let generatedCount = 0;

  // Generate placeholder for each company
  companies.forEach(company => {
    if (!company.slug) {
      console.warn(`Skipping company with missing slug: ${company.name || 'Unknown'}`);
      return;
    }

    const filename = `${company.slug}.txt`;
    const filepath = path.join(outputDir, filename);
    
    // Create placeholder content
    const placeholderContent = `OpenGraph Image Placeholder for: ${company.name || 'Unknown Company'}
Slug: ${company.slug}
Status: ${company.status || 'Unknown'}
Tagline: ${company.tagline || 'No tagline provided'}
Description: ${company.shortDescription || 'No description provided'}

Generated: ${new Date().toISOString()}

Note: This is a placeholder file. Replace with actual OG image generation
when implementing the full image rendering pipeline with satori/resvg.`;

    try {
      fs.writeFileSync(filepath, placeholderContent, 'utf8');
      generatedCount++;
    } catch (error) {
      console.error(`Error writing OG placeholder for ${company.slug}:`, error.message);
    }
  });

  console.log(`✅ OpenGraph placeholders generated: ${generatedCount} files`);
  console.log(`   Output directory: ${outputDir}`);
  console.log(`   Format: {slug}.txt (placeholder files)`);
  
  if (generatedCount < companies.length) {
    console.warn(`⚠️  Generated ${generatedCount} of ${companies.length} companies (some skipped due to missing slugs)`);
  }
}

// Run OG generation
generateOGImages();