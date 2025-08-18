#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { Resvg } from '@resvg/resvg-js';

interface Company {
  slug: string;
  name: string;
  tagline?: string;
  shortDescription?: string;
  primaryColor?: string;
  status: string;
}

/**
 * Generate OpenGraph images for companies
 */
async function generateOGImages(): Promise<void> {
  const cwd = process.cwd();
  const dataPath = resolve(cwd, 'src/data/companies.json');
  const outputDir = resolve(cwd, 'public/og');
  
  console.log('🎨 Generating OpenGraph images...');
  console.log(`Working directory: ${cwd}`);
  console.log(`Data source: ${dataPath}`);
  console.log(`Output directory: ${outputDir}`);

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created directory: ${outputDir}`);
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

  // Generate images for each company
  let successCount = 0;
  let errorCount = 0;

  for (const company of companies) {
    try {
      await generateCompanyOGImage(company, outputDir);
      successCount++;
      console.log(`✅ Generated OG image for: ${company.name} (${company.slug})`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to generate OG image for ${company.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('\n📊 Generation Summary:');
  console.log(`✅ Successfully generated: ${successCount} images`);
  if (errorCount > 0) {
    console.log(`❌ Failed to generate: ${errorCount} images`);
  }
  console.log('🎉 OpenGraph image generation completed!');
}

async function generateCompanyOGImage(company: Company, outputDir: string): Promise<void> {
  // For now, create a simple placeholder image approach
  // In a production setup, you would set up proper fonts or use a different approach
  
  console.log(`⚠️  Creating placeholder for ${company.name} - OG image generation requires font setup`);
  
  // Create a simple HTML-based approach for now
  const primaryColor = company.primaryColor || '#2563EB';
  const displayTagline = company.tagline || company.shortDescription || 'Building the future of innovation';
  
  // Simple SVG generation without satori for now
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor}15;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${primaryColor}05;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad1)"/>
      <rect x="50" y="50" width="120" height="40" rx="20" fill="${primaryColor}"/>
      <text x="110" y="75" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${company.status}</text>
      <text x="600" y="300" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="64" font-weight="bold">${company.name}</text>
      <text x="600" y="380" text-anchor="middle" fill="#4a4a4a" font-family="Arial, sans-serif" font-size="28">${displayTagline}</text>
      <rect x="1080" y="520" width="60" height="60" rx="12" fill="${primaryColor}"/>
      <text x="1110" y="560" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">${company.name.charAt(0).toUpperCase()}</text>
    </svg>
  `;

  // Convert SVG to PNG using resvg
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Save the image
  const outputPath = join(outputDir, `${company.slug}.png`);
  writeFileSync(outputPath, pngBuffer);
}

function getStatusBadge(status: string): { bg: string; color: string } {
  switch (status) {
    case 'ACTIVE':
      return { bg: '#10B981', color: '#FFFFFF' };
    case 'INCUBATION':
      return { bg: '#F59E0B', color: '#FFFFFF' };
    case 'RETIRED':
      return { bg: '#6B7280', color: '#FFFFFF' };
    case 'EXITED':
      return { bg: '#8B5CF6', color: '#FFFFFF' };
    default:
      return { bg: '#6B7280', color: '#FFFFFF' };
  }
}

// Run OG image generation
generateOGImages().catch(error => {
  console.error('❌ Failed to generate OG images:', error);
  process.exit(1);
});