'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

interface JobCardProps {
  title: string
  company: string
  location: string
  salary: string
  type: string
  onApply: () => void
}

export function JobCard({ title, company, location, salary, type, onApply }: JobCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-base font-medium text-gray-600">{company}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <BriefcaseIcon className="h-4 w-4" />
            <span>{type}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onApply} className="w-full">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  )
}
