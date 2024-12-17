'use client'

import { useParams } from 'next/navigation'
import { getJobById, getRelatedJobs, getAllDepartments } from '@/lib/jobs'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ApplicationForm } from '@/components/ApplicationForm'

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string
  const job = getJobById(jobId)
  const departments = getAllDepartments()
  const relatedJobs = job ? getRelatedJobs(job) : []

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            职位不存在或已下线
          </h1>
          <Link
            href="/jobs"
            className="text-primary-600 hover:text-primary-700"
          >
            返回职位列表
          </Link>
        </div>
      </div>
    )
  }

  const department = departments.find(d => d.id === job.department)

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/jobs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            返回职位列表
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.type}</span>
              <span>•</span>
              <span>{department?.name}</span>
            </div>
            <Button
              className="w-full sm:w-auto"
              size="lg"
              onClick={() => {
                const applicationForm = document.getElementById('application-form')
                if (applicationForm) {
                  applicationForm.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              立即申请
            </Button>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">职位描述</h2>
              <p className="text-gray-600">{job.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">工作职责</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">任职要求</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">福利待遇</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <p className="text-gray-500 text-sm">
                发布日期：{job.postedDate}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">申请职位</h2>
            <div id="application-form">
              <ApplicationForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </div>

        {relatedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关职位</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedJobs.map((relatedJob) => (
                <Link
                  key={relatedJob.id}
                  href={`/jobs/${relatedJob.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 mb-2">
                      {relatedJob.title}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {departments.find(d => d.id === relatedJob.department)?.name} · {relatedJob.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        {relatedJob.type} · {relatedJob.experience}
                      </p>
                      <p className="text-sm font-medium text-primary-600">
                        {relatedJob.salary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
