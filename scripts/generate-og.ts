import fs from 'fs';
import path from 'path';
import { getAllCompanies } from '../src/lib/data';

async function generatePlaceholderOGImages() {
  try {
    const companies = getAllCompanies();
    
    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'public', 'og');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`🎨 Generating placeholder OG images for ${companies.length} companies...`);

    // Create simple SVG placeholders and convert to PNG
    for (const company of companies) {
      try {
        const statusColor = company.status === 'active' ? '#10b981' : 
                          company.status === 'incubation' ? '#f59e0b' : '#3b82f6';

        // Create a simple SVG
        const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
          <rect x="100" y="100" width="1000" height="430" rx="24" fill="rgba(255,255,255,0.95)" stroke="none"/>
          <text x="600" y="200" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="#1f2937">${company.name}</text>
          <text x="600" y="260" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="#6b7280" font-style="italic">${company.tagline || company.shortDescription}</text>
          <rect x="450" y="300" width="120" height="40" rx="20" fill="${statusColor}"/>
          <text x="510" y="325" font-family="Arial, sans-serif" font-size="16" font-weight="600" text-anchor="middle" fill="white">${company.status === 'incubation' ? 'In Incubation' : company.status.charAt(0).toUpperCase() + company.status.slice(1)}</text>
          <rect x="580" y="300" width="120" height="40" rx="12" fill="#f3f4f6"/>
          <text x="640" y="325" font-family="Arial, sans-serif" font-size="16" font-weight="500" text-anchor="middle" fill="#374151">${company.category}</text>
          <line x1="200" y1="380" x2="1000" y2="380" stroke="#e5e7eb" stroke-width="2"/>
          <text x="600" y="420" font-family="Arial, sans-serif" font-size="20" font-weight="600" text-anchor="middle" fill="#9ca3af">CredoKaizen Portfolio</text>
        </svg>`;

        // Use sharp or canvas to convert SVG to PNG, but for now, let's just save the SVG and create a basic PNG placeholder
        const filename = `${company.slug}.png`;
        const svgFilename = `${company.slug}.svg`;
        const filepath = path.join(outputDir, filename);
        const svgFilepath = path.join(outputDir, svgFilename);
        
        // Save SVG version
        await fs.promises.writeFile(svgFilepath, svg);
        
        // Create a basic placeholder PNG (this is a very basic implementation)
        // In a real-world scenario, you'd use a proper SVG to PNG converter
        const placeholderPng = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x04, 0xB0, 0x00, 0x00, 0x02, 0x76,
          0x08, 0x02, 0x00, 0x00, 0x00, 0x8C, 0x2A, 0x57, 0x36
        ]);
        
        await fs.promises.writeFile(filepath, placeholderPng);
        console.log(`✅ Generated placeholder OG image: ${filename}`);
        
      } catch (error) {
        console.error(`❌ Failed to generate OG image for ${company.name}:`, error);
      }
    }

    // Generate default CredoKaizen OG image
    try {
      const defaultSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <rect x="150" y="150" width="900" height="330" rx="24" fill="rgba(255,255,255,0.95)" stroke="none"/>
        <text x="600" y="250" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#1f2937">CredoKaizen</text>
        <text x="600" y="320" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#6b7280">Venture Studio &amp; Innovation Lab</text>
      </svg>`;

      await fs.promises.writeFile(path.join(outputDir, 'credokaizen-default.svg'), defaultSvg);
      
      // Create basic placeholder PNG
      const defaultPlaceholderPng = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x04, 0xB0, 0x00, 0x00, 0x02, 0x76,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x8C, 0x2A, 0x57, 0x36
      ]);
      
      await fs.promises.writeFile(path.join(outputDir, 'credokaizen-default.png'), defaultPlaceholderPng);
      console.log('✅ Generated default CredoKaizen placeholder OG image');
      
    } catch (error) {
      console.error('❌ Failed to generate default OG image:', error);
    }

    console.log(`🎉 Placeholder OG image generation completed! Files saved to ${outputDir}`);
    console.log(`📝 Note: These are placeholder images. In production, use proper SVG to PNG conversion with tools like Puppeteer or Sharp.`);
    
  } catch (error) {
    console.error('❌ Error in OG image generation:', error);
    process.exit(1);
  }
}

// Run the script
generatePlaceholderOGImages();