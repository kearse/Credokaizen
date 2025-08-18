import { notFound } from "next/navigation";
import { getCompanyBySlug, getCompanySlugs } from "@/lib/data";
import Link from "next/link";

export async function generateStaticParams() {
  const slugs = getCompanySlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = getCompanyBySlug(params.slug);

  if (!company) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-block mb-6 text-primary hover:underline"
      >
        ← Back to Portfolio
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="w-16 h-16 mr-6"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
            {company.tagline && (
              <p className="text-xl text-gray-600">{company.tagline}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {company.longDescription || company.shortDescription}
              </p>
            </section>

            {company.products && company.products.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Products</h2>
                <div className="space-y-4">
                  {company.products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <h3 className="text-xl font-medium mb-2">
                        {product.url ? (
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {product.name}
                          </a>
                        ) : (
                          product.name
                        )}
                      </h3>
                      <p className="text-gray-600">{product.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Company Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        company.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : company.status === "INCUBATION"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {company.status}
                    </span>
                  </dd>
                </div>
                {company.websiteUrl && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd>
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}