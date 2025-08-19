#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates the companies.json data structure
 * Exits with code 1 if any validation errors are found
 */

const VALID_STATUSES = ['ACTIVE', 'INCUBATION', 'RETIRED', 'EXITED'];

function validateData() {
  const dataPath = path.join(process.cwd(), 'src/data/companies.json');
  
  // Check if file exists
  if (!fs.existsSync(dataPath)) {
    console.error('Error: src/data/companies.json not found');
    process.exit(1);
  }

  let companies;
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    companies = JSON.parse(rawData);
  } catch (error) {
    console.error('Error: Invalid JSON in companies.json:', error.message);
    process.exit(1);
  }

  if (!Array.isArray(companies)) {
    console.error('Error: companies.json must contain an array');
    process.exit(1);
  }

  const errors = [];
  const warnings = [];
  const seenIds = new Set();
  const seenSlugs = new Set();

  companies.forEach((company, index) => {
    const prefix = `Company ${index + 1}:`;

    // Validate required fields
    if (typeof company.id !== 'number' || company.id < 0 || !Number.isInteger(company.id)) {
      errors.push(`${prefix} id must be a non-negative integer, got: ${company.id}`);
    } else if (seenIds.has(company.id)) {
      errors.push(`${prefix} duplicate id: ${company.id}`);
    } else {
      seenIds.add(company.id);
    }

    if (typeof company.slug !== 'string' || company.slug.trim() === '') {
      errors.push(`${prefix} slug must be a non-empty string, got: ${company.slug}`);
    } else if (seenSlugs.has(company.slug)) {
      errors.push(`${prefix} duplicate slug: ${company.slug}`);
    } else {
      seenSlugs.add(company.slug);
    }

    if (typeof company.name !== 'string' || company.name.trim() === '') {
      errors.push(`${prefix} name must be a non-empty string, got: ${company.name}`);
    }

    if (!VALID_STATUSES.includes(company.status)) {
      errors.push(`${prefix} status must be one of ${VALID_STATUSES.join(', ')}, got: ${company.status}`);
    }

    // Validate optional fields and warn if missing
    if (!company.tagline || typeof company.tagline !== 'string' || company.tagline.trim() === '') {
      warnings.push(`${prefix} missing or empty tagline`);
    }

    if (!company.shortDescription || typeof company.shortDescription !== 'string' || company.shortDescription.trim() === '') {
      warnings.push(`${prefix} missing or empty shortDescription`);
    }
  });

  // Report results
  console.log(`Validation complete for ${companies.length} companies`);
  
  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    errors.forEach(error => console.log(`  - ${error}`));
    console.log('\nValidation failed!');
    process.exit(1);
  }

  console.log('\nValidation passed! ✅');
}

// Run validation
validateData();