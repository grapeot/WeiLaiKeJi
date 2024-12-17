import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), 'uploads', ...params.path)
    
    if (!existsSync(filePath)) {
      return new NextResponse('文件不存在', { status: 404 })
    }

    const fileBuffer = await readFile(filePath)
    const response = new NextResponse(fileBuffer)
    
    // 设置合适的Content-Type
    const fileName = params.path[params.path.length - 1]
    const fileExtension = fileName.split('.').pop()?.toLowerCase()
    
    switch (fileExtension) {
      case 'pdf':
        response.headers.set('Content-Type', 'application/pdf')
        break
      case 'doc':
        response.headers.set('Content-Type', 'application/msword')
        break
      case 'docx':
        response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        break
      default:
        response.headers.set('Content-Type', 'application/octet-stream')
    }
    
    // 设置文件名
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`)
    
    return response
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('内部服务器错误', { status: 500 })
  }
}
