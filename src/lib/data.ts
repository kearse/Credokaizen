import fs from 'fs';
import path from 'path';

// Types for the data structure
export interface Product {
  id: number;
  name: string;
  description: string;
  url?: string;
}

export interface Company {
  id: number;
  slug: string;
  name: string;
  tagline?: string;
  shortDescription?: string;
  longDescription?: string;
  status: 'ACTIVE' | 'INCUBATION' | 'RETIRED' | 'EXITED';
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  products: Product[];
}

// Function to read companies data from JSON file
export function getCompanies(): Company[] {
  const filePath = path.join(process.cwd(), 'src/data/companies.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as Company[];
}

// Function to get a single company by slug
export function getCompanyBySlug(slug: string): Company | null {
  const companies = getCompanies();
  return companies.find(company => company.slug === slug) || null;
}

// Function to get all company slugs (useful for static generation)
export function getCompanySlugs(): string[] {
  const companies = getCompanies();
  return companies.map(company => company.slug);
}