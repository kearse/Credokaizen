'use client';

import { Company } from '@/lib/data';
import clsx from 'clsx';

interface CompanyCardProps {
  company: Company;
  featured?: boolean;
}

export default function CompanyCard({ company, featured = false }: CompanyCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    incubation: 'bg-yellow-100 text-yellow-800',
    exited: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className={clsx(
      'company-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
      featured ? 'md:col-span-2 lg:col-span-1' : ''
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              <a 
                href={`/companies/${company.slug}`}
                className="hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
              >
                {company.name}
              </a>
            </h3>
            {company.tagline && (
              <p className="text-sm text-gray-600 italic mb-2">{company.tagline}</p>
            )}
          </div>
          <span className={clsx(
            'px-2 py-1 text-xs font-medium rounded-full',
            statusColors[company.status]
          )}>
            {company.status === 'incubation' ? 'Incubation' : company.status.charAt(0).toUpperCase() + company.status.slice(1)}
          </span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {company.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded-md">
              {company.category}
            </span>
            <span>Founded {company.foundedYear}</span>
          </div>
          
          <div className="flex space-x-2">
            <a
              href={`/companies/${company.slug}`}
              className="text-primary hover:text-primary/80 font-medium text-sm focus-ring rounded-md px-2 py-1"
            >
              Learn More
            </a>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 font-medium text-sm focus-ring rounded-md px-2 py-1"
              >
                Visit Site ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}