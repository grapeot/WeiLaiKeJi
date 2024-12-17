'use client'

import { useState } from 'react'
import { getAllJobs, getAllDepartments, getAllLocations } from '@/lib/jobs'
import Link from 'next/link'

export default function JobsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const jobs = getAllJobs()
  const departments = getAllDepartments()
  const locations = getAllLocations()

  const filteredJobs = jobs.filter((job) => {
    if (selectedDepartment && job.department !== selectedDepartment) {
      return false
    }
    if (selectedLocation && job.location !== selectedLocation) {
      return false
    }
    return true
  })

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 block">← 返回主页</Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">加入我们</h1>
          <p className="text-xl text-gray-600">
            探索激动人心的职业机会，与我们一起创造未来
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="flex-1">
            <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-1">
              按部门筛选
            </label>
            <select
              id="department-select"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              aria-label="按部门筛选"
            >
              <option value="">所有部门</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-1">
              按地点筛选
            </label>
            <select
              id="location-select"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="按地点筛选"
            >
              <option value="">所有地点</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              role="article"
              aria-label={job.title}
            >
              <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  {job.location}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  {job.type}
                </span>
              </div>
              <p className="text-sm text-gray-500">发布日期：{job.postedDate}</p>
              <Link
                href={`/jobs/${job.id}`}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                查看详情
              </Link>
            </article>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              暂无符合条件的职位
            </p>
          </div>
        )}

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">近期活动</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">线上招聘会</h3>
                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  线上
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                与我们的团队见面，了解各个部门的职位机会。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">2024年1月15日</span>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 border border-primary-600 text-primary-600 hover:bg-primary-50 h-9 px-4"
                >
                  了解更多
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">技术分享：构建可扩展系统</h3>
                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  线上+线下
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                加入我们的工程团队，深入探讨系统设计。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">2024年1月20日</span>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 border border-primary-600 text-primary-600 hover:bg-primary-50 h-9 px-4"
                >
                  了解更多
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">办公室开放日</h3>
                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  线下
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                参观我们的办公室，认识团队成员，亲身体验我们的企业文化。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">2024年1月25日</span>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 border border-primary-600 text-primary-600 hover:bg-primary-50 h-9 px-4"
                >
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
