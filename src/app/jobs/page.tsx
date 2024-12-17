'use client'

import { useState } from 'react'
import { getAllJobs, getAllDepartments, getAllLocations } from '@/lib/jobs'
import { Select } from '@/components/ui/Select'
import Link from 'next/link'

export default function JobsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const allJobs = getAllJobs()
  const departments = getAllDepartments()
  const locations = getAllLocations()

  const filteredJobs = allJobs.filter(job => {
    const matchDepartment = !selectedDepartment || job.department === selectedDepartment
    const matchLocation = !selectedLocation || job.location === selectedLocation
    return matchDepartment && matchLocation
  })

  const departmentOptions = [
    { value: '', label: '所有部门' },
    ...departments.map(dept => ({
      value: dept.id,
      label: dept.name
    }))
  ]

  const locationOptions = [
    { value: '', label: '所有地点' },
    ...locations.map(location => ({
      value: location,
      label: location
    }))
  ]

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
          <Select
            options={departmentOptions}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            label="按部门筛选"
          />
          <Select
            options={locationOptions}
            value={selectedLocation}
            onChange={setSelectedLocation}
            label="按地点筛选"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {job.description}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  发布日期：{job.postedDate}
                </span>
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 bg-primary-600 text-white hover:bg-primary-700 h-9 px-4"
                >
                  查看详情
                </Link>
              </div>
            </div>
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
