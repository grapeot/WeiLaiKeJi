import companyInfo from '../../../data/company_info.json'

export default function CulturePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-primary-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Culture</h1>
            <p className="text-2xl text-gray-600">
              Building a workplace where innovation and collaboration thrive
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {companyInfo.culture.values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600 text-lg">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {companyInfo.culture.perks_and_benefits.map((category) => (
              <div key={category.category} className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-6">{category.category}</h3>
                <ul className="space-y-4">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-primary-600 mr-2 flex-shrink-0"
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
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl font-medium italic text-gray-900">
              "We believe that a strong company culture is the foundation of innovation and success. 
              Our values guide everything we do, from how we work together to how we serve our customers."
            </blockquote>
            <p className="mt-4 text-gray-500">CEO of {companyInfo.company_name}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
