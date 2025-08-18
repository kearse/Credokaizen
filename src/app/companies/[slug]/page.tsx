import { notFound } from 'next/navigation'
import companies from '@/data/companies.json'

export async function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug,
  }))
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = companies.find((c) => c.slug === params.slug)

  if (!company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-4">{company.name}</h1>
          <p className="text-2xl text-gray-600 mb-6">{company.tagline}</p>
          
          <div className="mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              company.status === 'INCUBATION' ? 'bg-yellow-100 text-yellow-800' :
              company.status === 'RETIRED' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {company.status}
            </span>
          </div>
          
          <p className="text-lg text-gray-700 mb-6">{company.shortDescription}</p>
          <p className="text-gray-600 mb-8">{company.longDescription}</p>
          
          {company.websiteUrl && (
            <div className="mb-6">
              <a 
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
              >
                Visit Website
              </a>
            </div>
          )}
          
          <div className="flex gap-4">
            <a href="/companies" className="text-blue-600 hover:text-blue-800 font-medium">
              ← All Companies
            </a>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}