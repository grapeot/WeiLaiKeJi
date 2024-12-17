import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  let formData
  try {
    formData = await request.formData()
  } catch (error) {
    console.error('Form data parsing error:', error)
    return NextResponse.json(
      { error: '申请提交失败，请稍后再试' },
      { status: 500 }
    )
  }

  // Check for required resume file
  const resumeFile = formData.get('resume') as File
  if (!resumeFile) {
    return NextResponse.json(
      { error: '请上传简历文件' },
      { status: 400 }
    )
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename and save file
    const bytes = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${resumeFile.name}`
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Save application to database
    const application = await prisma.application.create({
      data: {
        jobId: formData.get('jobId') as string,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        education: formData.get('education') as string,
        experience: formData.get('experience') as string,
        skills: formData.get('skills') as string,
        resume: filename,
        coverLetter: formData.get('coverLetter') as string || null,
      },
    })

    return NextResponse.json(application, { status: 200 })
  } catch (error) {
    console.error('Database or file system error:', error)
    return NextResponse.json(
      { error: '申请提交失败，请稍后再试' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(applications, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch applications:', error)
    return NextResponse.json(
      { error: '获取申请列表失败' },
      { status: 500 }
    )
  }
}
