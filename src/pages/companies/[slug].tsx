import Head from 'next/head';
import Link from 'next/link';
import { getCompanies, getCompanyBySlug, Company } from '../../lib/companies';
import { GetStaticProps, GetStaticPaths } from 'next';

interface CompanyPageProps {
  company: Company;
}

export default function CompanyPage({ company }: CompanyPageProps) {
  return (
    <>
      <Head>
        <title>{company.name} - Credokaizen</title>
        <meta name="description" content={company.shortDescription || `Learn more about ${company.name}`} />
        <meta property="og:title" content={`${company.name} - Credokaizen`} />
        <meta property="og:description" content={company.shortDescription || `Learn more about ${company.name}`} />
        <meta property="og:image" content={`/og/companies/${company.slug}.svg`} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Directory
          </Link>
        </div>

        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">{company.name}</h1>
            <span className={`text-sm px-3 py-1 rounded ${
              company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              company.status === 'INCUBATION' ? 'bg-yellow-100 text-yellow-800' :
              company.status === 'RETIRED' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {company.status}
            </span>
          </div>

          {company.tagline && (
            <p className="text-xl text-blue-600 mb-6">{company.tagline}</p>
          )}

          <div className="animate-slide-in">
            {company.shortDescription && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{company.shortDescription}</p>
              </div>
            )}

            {company.website && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Website</h2>
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-lg"
                >
                  {company.website}
                </a>
              </div>
            )}

            <div className="border-t pt-8 mt-8">
              <h2 className="text-2xl font-semibold mb-4">Company Details</h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-gray-900">{company.status}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Company ID</dt>
                  <dd className="mt-1 text-gray-900">{company.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const companies = getCompanies();
  const paths = companies.map((company) => ({
    params: { slug: company.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const company = getCompanyBySlug(slug);

  if (!company) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      company,
    },
  };
};