import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CredoKaizen - Venture Studio & Innovation Lab',
  description: 'Building the next generation of technology companies through continuous improvement and innovation.',
  keywords: 'venture studio, startup incubator, technology innovation, kaizen, product development',
  authors: [{ name: 'CredoKaizen Team' }],
  creator: 'CredoKaizen',
  publisher: 'CredoKaizen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://credokaizen.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://credokaizen.com',
    siteName: 'CredoKaizen',
    title: 'CredoKaizen - Venture Studio & Innovation Lab',
    description: 'Building the next generation of technology companies through continuous improvement and innovation.',
    images: [
      {
        url: '/og/credokaizen-default.png',
        width: 1200,
        height: 630,
        alt: 'CredoKaizen Venture Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CredoKaizen - Venture Studio & Innovation Lab',
    description: 'Building the next generation of technology companies through continuous improvement and innovation.',
    images: ['/og/credokaizen-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Global JSON-LD structured data
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CredoKaizen',
  url: 'https://credokaizen.com',
  logo: 'https://credokaizen.com/logo.png',
  description: 'Venture studio and innovation lab building the next generation of technology companies.',
  foundingDate: '2020',
  sameAs: [
    'https://twitter.com/credokaizen',
    'https://linkedin.com/company/credokaizen',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'General Inquiry',
    email: 'info@credokaizen.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="font-sans">
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <a href="/" className="text-2xl font-bold text-primary focus-ring rounded-md px-2 py-1">
                  CredoKaizen
                </a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/"
                    className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium focus-ring"
                  >
                    Home
                  </a>
                  <a
                    href="/companies"
                    className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium focus-ring"
                  >
                    Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">CredoKaizen</h3>
              <p className="text-gray-400 mb-4">
                Building the future through continuous improvement and innovation.
              </p>
              <div className="flex justify-center space-x-6">
                <a href="mailto:info@credokaizen.com" className="text-gray-400 hover:text-white focus-ring rounded-md px-2 py-1">
                  Contact
                </a>
                <a href="/companies" className="text-gray-400 hover:text-white focus-ring rounded-md px-2 py-1">
                  Portfolio
                </a>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} CredoKaizen. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}