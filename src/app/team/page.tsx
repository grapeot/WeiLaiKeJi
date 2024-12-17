import companyInfo from '../../../data/company_info.json'

export default function TeamPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-primary-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-2xl text-gray-600">
              Meet the talented individuals who make {companyInfo.company_name} great
            </p>
          </div>
        </div>
      </section>

      {/* Department Sections */}
      {companyInfo.departments.map((dept) => (
        <section key={dept.name} className="py-20 even:bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">{dept.name}</h2>
              <p className="text-xl text-gray-600 mb-12">{dept.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {dept.teams.map((team) => (
                  <div key={team} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">{team}</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Collaborate with cross-functional teams</li>
                      <li>• Drive innovation and best practices</li>
                      <li>• Contribute to company's success</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Locations Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Where We Work</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {companyInfo.locations.map((location) => (
              <div key={location.city} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-primary-600 font-semibold mb-2">{location.type}</div>
                <h3 className="text-xl font-semibold mb-4">
                  {location.city}, {location.state && `${location.state}, `}{location.country}
                </h3>
                <p className="text-gray-600">{location.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Growing Team</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our values and passion for innovation.
            Check out our open positions and become part of our success story.
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
