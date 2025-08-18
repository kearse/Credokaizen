'use client';

import { useState, useEffect } from 'react';
import { Company, getUniqueCategories } from '@/lib/data';
import clsx from 'clsx';

interface CompanyFilterProps {
  companies: Company[];
  onFilterChange: (filteredCompanies: Company[]) => void;
  showLinks?: boolean;
}

export default function CompanyFilter({ companies, onFilterChange, showLinks = false }: CompanyFilterProps) {
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = getUniqueCategories();
  const statuses = [
    { value: 'all', label: 'All Companies' },
    { value: 'active', label: 'Active' },
    { value: 'incubation', label: 'In Incubation' },
    { value: 'exited', label: 'Exited' },
  ];

  useEffect(() => {
    let filtered = companies;

    if (activeStatus !== 'all') {
      filtered = filtered.filter(company => company.status === activeStatus);
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(company => company.category === activeCategory);
    }

    onFilterChange(filtered);
  }, [activeStatus, activeCategory, companies, onFilterChange]);

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status.value}
              onClick={() => setActiveStatus(status.value)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-ring',
                activeStatus === status.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-ring',
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-ring',
                activeCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links (if enabled) */}
      {showLinks && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Navigation</h3>
          <div className="space-y-2">
            <a
              href="/companies"
              className="block text-primary hover:text-primary/80 font-medium focus-ring rounded-md px-2 py-1"
            >
              View All Companies →
            </a>
            <a
              href="/#featured"
              className="block text-primary hover:text-primary/80 font-medium focus-ring rounded-md px-2 py-1"
            >
              Featured Companies →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}