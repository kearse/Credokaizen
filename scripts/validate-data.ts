#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { Company } from '../src/lib/data';

interface ValidationError {
  company?: string;
  field?: string;
  message: string;
}

function validateData(): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  
  // Check if companies.json exists
  const dataPath = path.join(process.cwd(), 'src/data/companies.json');
  if (!fs.existsSync(dataPath)) {
    errors.push({
      message: 'companies.json file not found at src/data/companies.json'
    });
    return { valid: false, errors };
  }

  let companies: Company[];
  
  // Parse JSON
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    companies = JSON.parse(fileContents);
  } catch (error) {
    errors.push({
      message: `Failed to parse companies.json: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    return { valid: false, errors };
  }

  // Validate that it's an array
  if (!Array.isArray(companies)) {
    errors.push({
      message: 'companies.json must contain an array of companies'
    });
    return { valid: false, errors };
  }

  // Track slugs for uniqueness validation
  const slugs = new Set<string>();
  const ids = new Set<number>();

  // Validate each company
  companies.forEach((company, index) => {
    const companyRef = `Company ${index + 1}${company.name ? ` (${company.name})` : ''}`;

    // Required fields validation
    if (!company.id) {
      errors.push({
        company: companyRef,
        field: 'id',
        message: 'Missing required field: id'
      });
    } else if (typeof company.id !== 'number') {
      errors.push({
        company: companyRef,
        field: 'id',
        message: 'Field "id" must be a number'
      });
    } else if (ids.has(company.id)) {
      errors.push({
        company: companyRef,
        field: 'id',
        message: `Duplicate id: ${company.id}`
      });
    } else {
      ids.add(company.id);
    }

    if (!company.slug) {
      errors.push({
        company: companyRef,
        field: 'slug',
        message: 'Missing required field: slug'
      });
    } else if (typeof company.slug !== 'string') {
      errors.push({
        company: companyRef,
        field: 'slug',
        message: 'Field "slug" must be a string'
      });
    } else if (!/^[a-z0-9-]+$/.test(company.slug)) {
      errors.push({
        company: companyRef,
        field: 'slug',
        message: 'Field "slug" must contain only lowercase letters, numbers, and hyphens'
      });
    } else if (slugs.has(company.slug)) {
      errors.push({
        company: companyRef,
        field: 'slug',
        message: `Duplicate slug: ${company.slug}`
      });
    } else {
      slugs.add(company.slug);
    }

    if (!company.name) {
      errors.push({
        company: companyRef,
        field: 'name',
        message: 'Missing required field: name'
      });
    } else if (typeof company.name !== 'string') {
      errors.push({
        company: companyRef,
        field: 'name',
        message: 'Field "name" must be a string'
      });
    }

    if (!company.status) {
      errors.push({
        company: companyRef,
        field: 'status',
        message: 'Missing required field: status'
      });
    } else if (!['ACTIVE', 'INCUBATION', 'RETIRED', 'EXITED'].includes(company.status)) {
      errors.push({
        company: companyRef,
        field: 'status',
        message: 'Field "status" must be one of: ACTIVE, INCUBATION, RETIRED, EXITED'
      });
    }

    // Optional field type validation
    if (company.tagline && typeof company.tagline !== 'string') {
      errors.push({
        company: companyRef,
        field: 'tagline',
        message: 'Field "tagline" must be a string'
      });
    }

    if (company.shortDescription && typeof company.shortDescription !== 'string') {
      errors.push({
        company: companyRef,
        field: 'shortDescription',
        message: 'Field "shortDescription" must be a string'
      });
    }

    if (company.longDescription && typeof company.longDescription !== 'string') {
      errors.push({
        company: companyRef,
        field: 'longDescription',
        message: 'Field "longDescription" must be a string'
      });
    }

    if (company.websiteUrl && (typeof company.websiteUrl !== 'string' || !company.websiteUrl.startsWith('http'))) {
      errors.push({
        company: companyRef,
        field: 'websiteUrl',
        message: 'Field "websiteUrl" must be a valid URL starting with http:// or https://'
      });
    }

    if (company.logoUrl && typeof company.logoUrl !== 'string') {
      errors.push({
        company: companyRef,
        field: 'logoUrl',
        message: 'Field "logoUrl" must be a string'
      });
    }

    if (company.primaryColor && (typeof company.primaryColor !== 'string' || !company.primaryColor.match(/^#[0-9A-Fa-f]{6}$/))) {
      errors.push({
        company: companyRef,
        field: 'primaryColor',
        message: 'Field "primaryColor" must be a valid hex color (e.g., #FF0000)'
      });
    }

    // Validate products array
    if (company.products && !Array.isArray(company.products)) {
      errors.push({
        company: companyRef,
        field: 'products',
        message: 'Field "products" must be an array'
      });
    } else if (company.products) {
      company.products.forEach((product, productIndex) => {
        const productRef = `${companyRef} - Product ${productIndex + 1}`;
        
        if (!product.id || typeof product.id !== 'number') {
          errors.push({
            company: productRef,
            field: 'id',
            message: 'Product missing required field "id" (number)'
          });
        }

        if (!product.name || typeof product.name !== 'string') {
          errors.push({
            company: productRef,
            field: 'name',
            message: 'Product missing required field "name" (string)'
          });
        }

        if (!product.description || typeof product.description !== 'string') {
          errors.push({
            company: productRef,
            field: 'description',
            message: 'Product missing required field "description" (string)'
          });
        }

        if (product.url && (typeof product.url !== 'string' || !product.url.startsWith('http'))) {
          errors.push({
            company: productRef,
            field: 'url',
            message: 'Product field "url" must be a valid URL starting with http:// or https://'
          });
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

function main() {
  console.log('🔍 Validating companies.json data...\n');
  
  const result = validateData();
  
  if (result.valid) {
    console.log('✅ All validation checks passed!');
    console.log(`📊 Validated ${result.errors.length === 0 ? 'data' : ''} successfully.`);
    process.exit(0);
  } else {
    console.log('❌ Validation failed with the following errors:\n');
    
    result.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.company || 'General'}`);
      if (error.field) {
        console.log(`   Field: ${error.field}`);
      }
      console.log(`   Error: ${error.message}\n`);
    });
    
    console.log(`💥 Found ${result.errors.length} validation error${result.errors.length === 1 ? '' : 's'}.`);
    console.log('Please fix the errors above and try again.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { validateData };