import companies from '@/data/companies.json'

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Our Companies</h1>
        
        <div className="grid gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-3xl font-semibold mb-2">{company.name}</h2>
              <p className="text-xl text-gray-600 mb-4">{company.tagline}</p>
              <p className="text-gray-700 mb-4">{company.shortDescription}</p>
              <p className="text-gray-600 mb-6">{company.longDescription}</p>
              
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  company.status === 'INCUBATION' ? 'bg-yellow-100 text-yellow-800' :
                  company.status === 'RETIRED' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {company.status}
                </span>
                {company.websiteUrl && (
                  <a 
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}