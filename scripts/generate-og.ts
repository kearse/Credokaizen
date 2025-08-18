#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { getCompanies } from '../src/lib/data';

// Mock OG image generation (in a real implementation, you'd use a library like @vercel/og or similar)
function generateOGImage(company: any): Buffer {
  // This is a placeholder - in a real implementation you would:
  // 1. Use a library like @vercel/og, sharp, or canvas to generate images
  // 2. Create an image with the company name, tagline, and branding
  // For now, we'll create a simple text-based "image" as a placeholder
  
  const content = `OG Image for ${company.name}\nTagline: ${company.tagline || 'N/A'}`;
  return Buffer.from(content, 'utf8');
}

function generateOGImages() {
  const companies = getCompanies();
  const ogDir = path.join(process.cwd(), 'public', 'og');
  
  // Ensure og directory exists
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }

  let generated = 0;
  let skipped = 0;

  for (const company of companies) {
    const ogPath = path.join(ogDir, `${company.slug}.png`);
    
    // Check if image already exists
    if (fs.existsSync(ogPath)) {
      console.log(`⏭️  Skipping ${company.slug} (already exists)`);
      skipped++;
      continue;
    }

    try {
      // Generate the OG image (placeholder implementation)
      const imageBuffer = generateOGImage(company);
      fs.writeFileSync(ogPath, imageBuffer);
      
      console.log(`✅ Generated OG image for ${company.name} -> ${company.slug}.png`);
      generated++;
    } catch (error) {
      console.error(`❌ Failed to generate OG image for ${company.slug}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total companies: ${companies.length}`);
}

if (require.main === module) {
  generateOGImages();
}

export { generateOGImages };