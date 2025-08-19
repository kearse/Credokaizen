const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'companies.json');
const OG_DIR = path.join(__dirname, '..', 'public', 'og');
const COMPANIES_OG_DIR = path.join(OG_DIR, 'companies');

async function generateOGImages() {
  console.log('🖼️  Generating OG placeholder images...');
  
  try {
    // Ensure directories exist
    if (!fs.existsSync(OG_DIR)) {
      fs.mkdirSync(OG_DIR, { recursive: true });
    }
    if (!fs.existsSync(COMPANIES_OG_DIR)) {
      fs.mkdirSync(COMPANIES_OG_DIR, { recursive: true });
    }
    
    const companies = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    
    // Create simple SVG placeholders (better than nothing)
    
    // Homepage OG image
    const homepageSVG = createPlaceholderSVG('Credokaizen', 'Company Directory', 'A curated directory of innovative companies');
    fs.writeFileSync(path.join(OG_DIR, 'homepage.svg'), homepageSVG);
    
    // Company OG images
    let generatedCount = 0;
    for (const company of companies) {
      const companySVG = createPlaceholderSVG(
        company.name, 
        company.tagline || 'Company Profile',
        company.shortDescription || `Learn more about ${company.name}`,
        company.status
      );
      fs.writeFileSync(path.join(COMPANIES_OG_DIR, `${company.slug}.svg`), companySVG);
      generatedCount++;
    }
    
    console.log(`✅ Generated ${generatedCount + 1} OG placeholder images`);
    console.log(`   Homepage: ${path.join(OG_DIR, 'homepage.svg')}`);
    console.log(`   Companies: ${COMPANIES_OG_DIR}`);
    console.log('   Note: Generated as SVG placeholders. For PNG generation, enhance this script with working satori + resvg setup.');
    
  } catch (error) {
    console.error('❌ Failed to generate OG images:', error.message);
    process.exit(1);
  }
}

function createPlaceholderSVG(title, subtitle, description, status) {
  const statusColor = status === 'ACTIVE' ? '#10b981' : 
                     status === 'INCUBATION' ? '#f59e0b' :
                     status === 'RETIRED' ? '#6b7280' : '#3b82f6';
                     
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="200" fill="white" font-size="72" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif">${escapeXML(title)}</text>
  <text x="600" y="280" fill="white" font-size="36" text-anchor="middle" font-family="Arial, sans-serif" opacity="0.9">${escapeXML(subtitle)}</text>
  <text x="600" y="350" fill="white" font-size="24" text-anchor="middle" font-family="Arial, sans-serif" opacity="0.8">${escapeXML(description.length > 80 ? description.substring(0, 80) + '...' : description)}</text>
  ${status ? `<rect x="550" y="400" width="100" height="40" rx="8" fill="${statusColor}"/>
  <text x="600" y="425" fill="white" font-size="18" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif">${status}</text>` : ''}
</svg>`;
}

function escapeXML(text) {
  return text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#39;');
}

generateOGImages();