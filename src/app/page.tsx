import companies from '@/data/companies.json'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">CredoKaizen Portfolio</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Building the future through innovative companies
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-2">{company.name}</h2>
              <p className="text-gray-600 mb-2">{company.tagline}</p>
              <p className="text-sm text-gray-500 mb-4">{company.shortDescription}</p>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  company.status === 'INCUBATION' ? 'bg-yellow-100 text-yellow-800' :
                  company.status === 'RETIRED' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {company.status}
                </span>
                <a 
                  href={`/companies/${company.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}