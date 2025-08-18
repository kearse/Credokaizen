const fs = require('fs');
const path = require('path');

function generateOGImages() {
  const companiesPath = path.join(process.cwd(), 'src/data/companies.json');
  const ogPath = path.join(process.cwd(), 'public/og');

  // Ensure og directory exists
  if (!fs.existsSync(ogPath)) {
    fs.mkdirSync(ogPath, { recursive: true });
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

  // For now, create placeholder OG images
  // In a real implementation, you would use satori and @resvg/resvg-js to generate actual images
  companies.forEach(company => {
    const ogImagePath = path.join(ogPath, `${company.slug}.png`);
    
    // Create a simple text file as placeholder (in real implementation this would be a PNG)
    const placeholderContent = `OG Image for ${company.name}\nTagline: ${company.tagline || 'No tagline'}\nDescription: ${company.shortDescription || 'No description'}`;
    
    // For now, just create a simple text file as placeholder
    // TODO: Implement actual image generation with satori + @resvg/resvg-js
    fs.writeFileSync(ogImagePath.replace('.png', '.txt'), placeholderContent);
  });

  console.log(`✅ Generated ${companies.length} OG image placeholders`);
  console.log('Note: This is a placeholder implementation. For actual PNG generation,');
  console.log('implement satori + @resvg/resvg-js image rendering in this script.');
}

generateOGImages();