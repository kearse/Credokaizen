'use client';

import { getFeaturedCompanies } from '@/lib/data';
import CompanyCard from '@/components/CompanyCard';
import { motion } from 'framer-motion';

export default function HomePage() {
  const featuredCompanies = getFeaturedCompanies();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Building the Future Through{' '}
              <span className="text-primary">Continuous Innovation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              CredoKaizen is a venture studio and innovation lab that partners with entrepreneurs 
              and enterprises to build transformative technology companies through the principles of Kaizen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/companies"
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 focus-ring"
              >
                Explore Our Portfolio
              </a>
              <a
                href="mailto:info@credokaizen.com"
                className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 focus-ring"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section id="featured" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our flagship portfolio companies that are reshaping industries 
              through innovative technology and strategic execution.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {featuredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <CompanyCard company={company} featured />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <a
              href="/companies"
              className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-lg focus-ring rounded-md px-3 py-2"
            >
              View All Companies
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Kaizen Approach to Innovation
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe in continuous improvement - the Japanese philosophy of Kaizen. 
                By applying this principle to venture building, we create companies that are 
                not just innovative at launch, but continuously evolving and adapting.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our methodology combines deep market research, rapid prototyping, 
                and iterative development to build products that truly serve market needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-4 text-gray-700">Market-Driven Innovation</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-4 text-gray-700">Rapid Prototyping & Testing</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-4 text-gray-700">Continuous Improvement</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">6+</div>
                  <div className="text-gray-600">Companies Launched</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">3</div>
                  <div className="text-gray-600">Active Portfolio</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">1</div>
                  <div className="text-gray-600">Successful Exit</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">4</div>
                  <div className="text-gray-600">Years of Innovation</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}