import Head from 'next/head';
import Link from 'next/link';
import { getCompanies, Company } from '../lib/companies';

interface HomeProps {
  companies: Company[];
}

export default function Home({ companies }: HomeProps) {
  return (
    <>
      <Head>
        <title>Credokaizen - Company Directory</title>
        <meta name="description" content="A curated directory of innovative companies" />
        <meta property="og:title" content="Credokaizen - Company Directory" />
        <meta property="og:description" content="A curated directory of innovative companies" />
        <meta property="og:image" content="/og/homepage.svg" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-center">Credokaizen</h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            A curated directory of innovative companies
          </p>
        </div>

        <div className="animate-slide-in">
          <h2 className="text-2xl font-semibold mb-6">Companies</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.slug}/`}>
                <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      company.status === 'INCUBATION' ? 'bg-yellow-100 text-yellow-800' :
                      company.status === 'RETIRED' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {company.status}
                    </span>
                  </div>
                  {company.tagline && (
                    <p className="text-blue-600 text-sm mb-2">{company.tagline}</p>
                  )}
                  {company.shortDescription && (
                    <p className="text-gray-600 text-sm">{company.shortDescription}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const companies = getCompanies();
  
  return {
    props: {
      companies,
    },
  };
}