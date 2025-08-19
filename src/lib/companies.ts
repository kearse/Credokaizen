import companiesData from '../data/companies.json';

export interface Company {
  id: number;
  slug: string;
  name: string;
  status: 'ACTIVE' | 'INCUBATION' | 'RETIRED' | 'EXITED';
  tagline?: string;
  shortDescription?: string;
  website?: string;
}

export function getCompanies(): Company[] {
  return companiesData as Company[];
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return companiesData.find(company => company.slug === slug) as Company | undefined;
}

export function getCompanyById(id: number): Company | undefined {
  return companiesData.find(company => company.id === id) as Company | undefined;
}