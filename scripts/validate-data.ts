const fs = require('fs');
const path = require('path');

function validateData() {
  const companiesPath = path.join(process.cwd(), 'src/data/companies.json');
  
  if (!fs.existsSync(companiesPath)) {
    console.error('Error: companies.json file not found at src/data/companies.json');
    process.exit(1);
  }

  let companies;
  try {
    const content = fs.readFileSync(companiesPath, 'utf-8');
    companies = JSON.parse(content);
  } catch (error) {
    console.error('Error: Invalid JSON in companies.json');
    console.error(error);
    process.exit(1);
  }

  if (!Array.isArray(companies)) {
    console.error('Error: companies.json must contain an array of companies');
    process.exit(1);
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const slugs = new Set();
  const ids = new Set();
  const validStatuses = ['ACTIVE', 'INCUBATION', 'RETIRED', 'EXITED'];

  companies.forEach((company, index) => {
    const prefix = `Company ${index + 1}`;

    // Required field validations
    if (typeof company.id !== 'number' || !Number.isInteger(company.id) || company.id < 0) {
      errors.push(`${prefix}: 'id' must be a non-negative integer`);
    } else if (ids.has(company.id)) {
      errors.push(`${prefix}: 'id' ${company.id} is not unique`);
    } else {
      ids.add(company.id);
    }

    if (typeof company.slug !== 'string' || company.slug.trim() === '') {
      errors.push(`${prefix}: 'slug' must be a non-empty string`);
    } else if (slugs.has(company.slug)) {
      errors.push(`${prefix}: 'slug' "${company.slug}" is not unique`);
    } else {
      slugs.add(company.slug);
    }

    if (typeof company.name !== 'string' || company.name.trim() === '') {
      errors.push(`${prefix}: 'name' must be a non-empty string`);
    }

    if (!validStatuses.includes(company.status)) {
      errors.push(`${prefix}: 'status' must be one of: ${validStatuses.join(', ')}`);
    }

    // Optional field warnings
    if (!company.tagline || company.tagline.trim() === '') {
      warnings.push(`${prefix}: Missing 'tagline' field`);
    }

    if (!company.shortDescription || company.shortDescription.trim() === '') {
      warnings.push(`${prefix}: Missing 'shortDescription' field`);
    }
  });

  // Print warnings
  if (warnings.length > 0) {
    console.warn('Warnings:');
    warnings.forEach(warning => console.warn(`  ${warning}`));
    console.warn('');
  }

  // Print errors and exit if any
  if (errors.length > 0) {
    console.error('Validation errors:');
    errors.forEach(error => console.error(`  ${error}`));
    process.exit(1);
  }

  console.log(`✅ Validation passed! Found ${companies.length} valid companies.`);
}

validateData();