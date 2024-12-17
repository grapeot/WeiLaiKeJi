import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // 处理文件上传
    const resumeFile = formData.get('resume') as File
    if (!resumeFile) {
      return NextResponse.json(
        { error: '请上传简历' },
        { status: 400 }
      )
    }

    // 生成唯一的文件名
    const bytes = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${resumeFile.name}`
    const uploadDir = join(process.cwd(), 'uploads')
    const filepath = join(uploadDir, filename)
    
    // 保存文件
    await writeFile(filepath, buffer)

    // 保存申请信息到数据库
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

    return NextResponse.json(application)
  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: '提交申请失败' },
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

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Failed to fetch applications:', error)
    return NextResponse.json(
      { error: '获取申请列表失败' },
      { status: 500 }
    )
  }
}
