import Link from "next/link";
import { getCompanies } from "@/lib/data";

export default function HomePage() {
  const companies = getCompanies();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">CredoKaizen</h1>
        <p className="text-xl text-gray-600 mb-8">
          A strategic portfolio of innovative companies and products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center mb-4">
              {company.logoUrl && (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="w-12 h-12 mr-4"
                />
              )}
              <h2 className="text-xl font-semibold group-hover:text-primary">
                {company.name}
              </h2>
            </div>
            <p className="text-gray-600 text-sm mb-2">{company.tagline}</p>
            <p className="text-gray-500 text-sm">{company.shortDescription}</p>
            <span
              className={`inline-block mt-3 px-2 py-1 text-xs rounded ${
                company.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : company.status === "INCUBATION"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {company.status}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}