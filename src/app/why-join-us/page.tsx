import companyInfo from '../../../data/company_info.json'

export default function WhyJoinUsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-primary-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Why Join {companyInfo.company_name}?</h1>
            <p className="text-2xl text-gray-600">
              Discover the opportunities and experiences that make us unique
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600">{companyInfo.mission}</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-xl text-gray-600">{companyInfo.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Opportunities Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Growth Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Professional Development</h3>
              <p className="text-gray-600">
                Access to continuous learning resources, mentorship programs, and skill development opportunities.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Career Advancement</h3>
              <p className="text-gray-600">
                Clear career paths and opportunities for internal mobility across teams and departments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Innovation Focus</h3>
              <p className="text-gray-600">
                Work on cutting-edge projects and contribute to shaping the future of technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Employee Experience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">The Employee Experience</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {companyInfo.culture.values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Highlight Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Comprehensive Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {companyInfo.culture.perks_and_benefits.map((category) => (
              <div key={category.category} className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-center text-gray-600">
                      <svg
                        className="h-5 w-5 text-primary-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our current openings and take the first step towards an exciting career with {companyInfo.company_name}.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 bg-primary-600 text-white hover:bg-primary-700 h-10 px-8 py-2"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </main>
  )
}
