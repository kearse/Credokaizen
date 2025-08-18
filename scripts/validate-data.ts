#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

interface Company {
  id: number;
  slug: string;
  name: string;
  status: 'ACTIVE' | 'INCUBATION' | 'RETIRED' | 'EXITED';
  tagline?: string;
  shortDescription?: string;
  longDescription?: string;
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  products?: any[];
}

/**
 * Validate companies data with robust file path resolution and error reporting
 */
function validateCompaniesData(): void {
  const cwd = process.cwd();
  const dataPath = resolve(cwd, 'src/data/companies.json');
  const schemaPath = resolve(cwd, 'companies.schema.json');
  
  console.log('🔍 Validating companies data...');
  console.log(`Working directory: ${cwd}`);
  console.log(`Data file: ${dataPath}`);
  console.log(`Schema file: ${schemaPath}`);

  let errors: string[] = [];
  let warnings: string[] = [];

  // Check if data file exists
  if (!existsSync(dataPath)) {
    errors.push(`❌ Companies data file not found: ${dataPath}`);
    console.error('❌ Critical error: companies.json not found');
    process.exit(1);
  }

  // Read and parse data file
  let companies: Company[];
  try {
    const dataContent = readFileSync(dataPath, 'utf8');
    companies = JSON.parse(dataContent);
    console.log(`✅ Successfully loaded ${companies.length} companies`);
  } catch (error) {
    errors.push(`❌ Failed to parse companies.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('❌ Critical error: Failed to parse companies.json');
    process.exit(1);
  }

  // Validate data structure
  if (!Array.isArray(companies)) {
    errors.push('❌ Companies data must be an array');
  } else {
    // Check for required fields and duplicates
    const slugs = new Set<string>();
    const ids = new Set<number>();

    companies.forEach((company, index) => {
      const prefix = `Company ${index + 1}:`;

      // Required fields validation
      if (typeof company.id !== 'number' || company.id < 1) {
        errors.push(`${prefix} Invalid or missing id`);
      } else if (ids.has(company.id)) {
        errors.push(`${prefix} Duplicate id: ${company.id}`);
      } else {
        ids.add(company.id);
      }

      if (!company.slug || typeof company.slug !== 'string') {
        errors.push(`${prefix} Missing or invalid slug`);
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(company.slug)) {
        errors.push(`${prefix} Invalid slug format: ${company.slug}`);
      } else if (slugs.has(company.slug)) {
        errors.push(`${prefix} Duplicate slug: ${company.slug}`);
      } else {
        slugs.add(company.slug);
      }

      if (!company.name || typeof company.name !== 'string') {
        errors.push(`${prefix} Missing or invalid name`);
      }

      if (!company.status || !['ACTIVE', 'INCUBATION', 'RETIRED', 'EXITED'].includes(company.status)) {
        errors.push(`${prefix} Invalid status: ${company.status}`);
      }

      // Optional field warnings
      if (!company.tagline) {
        warnings.push(`${prefix} Missing tagline (recommended for OG images)`);
      }

      if (!company.shortDescription) {
        warnings.push(`${prefix} Missing shortDescription (recommended for previews)`);
      }

      if (company.websiteUrl && !/^https?:\/\/.+/.test(company.websiteUrl)) {
        warnings.push(`${prefix} Website URL should be a valid HTTP(S) URL`);
      }

      if (company.primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(company.primaryColor)) {
        warnings.push(`${prefix} Primary color should be a valid hex color (e.g., #FF0000)`);
      }
    });
  }

  // Report results
  console.log('\n📊 Validation Summary:');
  
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s) found:`);
    errors.forEach(error => console.log(`  ${error}`));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s) found:`);
    warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All validation checks passed!');
  } else if (errors.length === 0) {
    console.log('✅ No critical errors found. Warnings are recommendations only.');
  }

  // Check schema file existence (informational only)
  if (existsSync(schemaPath)) {
    console.log(`\n📋 JSON Schema available at: ${schemaPath}`);
    console.log('   Use with VS Code or your editor for live validation.');
  } else {
    console.log('\n💡 Tip: Consider adding companies.schema.json for editor validation.');
  }

  // Exit with error code if there are critical errors
  if (errors.length > 0) {
    console.log('\n💥 Validation failed with errors. Please fix the issues above.');
    process.exit(1);
  }

  console.log('\n🎉 Data validation completed successfully!');
}

// Run validation
validateCompaniesData();