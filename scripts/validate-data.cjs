const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'companies.json');

function validateData() {
  console.log('🔍 Validating companies data...');
  
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    
    if (!Array.isArray(data)) {
      throw new Error('Companies data must be an array');
    }
    
    const ids = new Set();
    const slugs = new Set();
    let errors = 0;
    let warnings = 0;
    
    data.forEach((company, index) => {
      const prefix = `Company ${index + 1}:`;
      
      // Required fields
      if (typeof company.id !== 'number' || company.id < 0) {
        console.error(`❌ ${prefix} Invalid or missing id (must be non-negative number)`);
        errors++;
      }
      
      if (!company.slug || typeof company.slug !== 'string') {
        console.error(`❌ ${prefix} Invalid or missing slug (must be non-empty string)`);
        errors++;
      }
      
      if (!company.name || typeof company.name !== 'string') {
        console.error(`❌ ${prefix} Invalid or missing name (must be non-empty string)`);
        errors++;
      }
      
      if (!['ACTIVE', 'INCUBATION', 'RETIRED', 'EXITED'].includes(company.status)) {
        console.error(`❌ ${prefix} Invalid status (must be ACTIVE, INCUBATION, RETIRED, or EXITED)`);
        errors++;
      }
      
      // Check for duplicates
      if (ids.has(company.id)) {
        console.error(`❌ ${prefix} Duplicate id: ${company.id}`);
        errors++;
      } else {
        ids.add(company.id);
      }
      
      if (slugs.has(company.slug)) {
        console.error(`❌ ${prefix} Duplicate slug: ${company.slug}`);
        errors++;
      } else {
        slugs.add(company.slug);
      }
      
      // Optional fields (warnings only)
      if (!company.tagline) {
        console.warn(`⚠️  ${prefix} Missing tagline (optional but recommended)`);
        warnings++;
      }
      
      if (!company.shortDescription) {
        console.warn(`⚠️  ${prefix} Missing shortDescription (optional but recommended)`);
        warnings++;
      }
      
      if (!company.website) {
        console.warn(`⚠️  ${prefix} Missing website (optional but recommended)`);
        warnings++;
      }
    });
    
    console.log(`\n📊 Validation Summary:`);
    console.log(`   Companies: ${data.length}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Warnings: ${warnings}`);
    
    if (errors > 0) {
      console.error('\n❌ Validation failed! Please fix the errors above.');
      process.exit(1);
    } else {
      console.log('\n✅ Validation passed!');
    }
    
  } catch (error) {
    console.error('❌ Failed to validate data:', error.message);
    process.exit(1);
  }
}

validateData();