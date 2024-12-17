import Link from 'next/link'
import companyInfo from '@/../data/company_info.json'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-primary-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{companyInfo.company_name}</h1>
            <p className="text-2xl text-gray-600 mb-8">{companyInfo.tagline}</p>
            <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 bg-primary-600 text-white hover:bg-primary-700 h-10 px-8 py-2"
            >
              查看开放职位
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">关于我们</h2>
            <p className="text-lg text-gray-600 mb-8">{companyInfo.about.description}</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">我们的使命</h3>
                <p className="text-gray-600">{companyInfo.about.mission}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">我们的愿景</h3>
                <p className="text-gray-600">{companyInfo.about.vision}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">我们的部门</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyInfo.departments.map((dept) => (
              <div key={dept.name} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{dept.name}</h3>
                <p className="text-gray-600 mb-4">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">我们的价值观</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyInfo.culture.values.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">我们的地点</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.locations.map((location) => (
              <div key={location.city} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{location.city}</h3>
                <div className="text-primary-600 mb-4">{location.address}</div>
                <p className="text-gray-600">{location.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">加入我们的团队</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            成为我们团队的一员，共同创造未来。
          </p>
          <Link 
            href="/jobs" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 bg-white text-primary-600 hover:bg-gray-100 h-10 px-8 py-2"
          >
            查看开放职位
          </Link>
        </div>
      </section>
    </main>
  )
}
