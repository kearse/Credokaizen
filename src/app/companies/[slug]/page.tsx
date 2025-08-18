import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllCompanySlugs, getCompanyBySlug } from '@/lib/data';

interface CompanyPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all companies
export async function generateStaticParams() {
  const slugs = getAllCompanySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each company page
export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const company = getCompanyBySlug(params.slug);
  
  if (!company) {
    return {
      title: 'Company Not Found - CredoKaizen',
      description: 'The requested company could not be found.',
    };
  }

  return {
    title: `${company.name} - CredoKaizen Portfolio`,
    description: company.description,
    keywords: `${company.name}, ${company.category}, ${company.status}, venture studio, startup`,
    openGraph: {
      title: `${company.name} - CredoKaizen Portfolio`,
      description: company.shortDescription,
      url: `https://credokaizen.com/companies/${company.slug}`,
      siteName: 'CredoKaizen',
      images: [
        {
          url: `/og/${company.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${company.name} - ${company.tagline || company.shortDescription}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.name} - CredoKaizen Portfolio`,
      description: company.shortDescription,
      images: [`/og/${company.slug}.png`],
    },
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const company = getCompanyBySlug(params.slug);

  if (!company) {
    notFound();
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    incubation: 'bg-yellow-100 text-yellow-800',
    exited: 'bg-blue-100 text-blue-800',
  };

  // JSON-LD structured data for this specific company
  const companyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: company.name,
    description: company.description,
    url: company.website,
    applicationCategory: company.category,
    operatingSystem: 'Web',
    datePublished: `${company.foundedYear}-01-01`,
    author: {
      '@type': 'Organization',
      name: 'CredoKaizen',
      url: 'https://credokaizen.com',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(companyJsonLd),
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in">
                <div className="flex items-center space-x-4 mb-6">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[company.status]}`}>
                    {company.status === 'incubation' ? 'In Incubation' : company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{company.category}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">Founded {company.foundedYear}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {company.name}
                </h1>
                
                {company.tagline && (
                  <p className="text-xl text-gray-600 italic mb-6">
                    {company.tagline}
                  </p>
                )}

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {company.shortDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 focus-ring text-center"
                    >
                      Visit Website ↗
                    </a>
                  )}
                  <a
                    href="/companies"
                    className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 focus-ring text-center"
                  >
                    View All Companies
                  </a>
                </div>
              </div>

              <div className="animate-fade-in bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">
                      {company.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Overview</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{company.status === 'incubation' ? 'In Incubation' : company.status.charAt(0).toUpperCase() + company.status.slice(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry:</span>
                      <span className="font-medium">{company.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Founded:</span>
                      <span className="font-medium">{company.foundedYear}</span>
                    </div>
                    {company.website && (
                      <div className="flex justify-between">
                        <span>Website:</span>
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:text-primary/80 focus-ring rounded-sm"
                        >
                          Visit Site ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Description */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {company.name}</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{company.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Portfolio */}
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <a
              href="/companies"
              className="inline-flex items-center text-primary hover:text-primary/80 font-semibold focus-ring rounded-md px-3 py-2"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Portfolio
            </a>
          </div>
        </section>
      </div>
    </>
  );
}