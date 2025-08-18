import companiesData from '../data/companies.json';

export interface Company {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  tagline?: string;
  description: string;
  status: 'active' | 'incubation' | 'exited';
  category: string;
  foundedYear: number;
  website: string;
  featured: boolean;
}

export function getAllCompanies(): Company[] {
  return companiesData as Company[];
}

export function getFeaturedCompanies(): Company[] {
  return getAllCompanies().filter(company => company.featured);
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return getAllCompanies().find(company => company.slug === slug);
}

export function getAllCompanySlugs(): string[] {
  return getAllCompanies().map(company => company.slug);
}

export function getCompaniesByStatus(status: string): Company[] {
  if (status === 'all') return getAllCompanies();
  return getAllCompanies().filter(company => company.status === status);
}

export function getCompaniesByCategory(category: string): Company[] {
  if (category === 'all') return getAllCompanies();
  return getAllCompanies().filter(company => company.category === category);
}

export function getUniqueCategories(): string[] {
  const categories = getAllCompanies().map(company => company.category);
  return Array.from(new Set(categories)).sort();
}