import { writeFile } from "fs/promises"
import path from "path"
import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/middleware"

export async function POST(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error
    
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const uploadDir = path.join(process.cwd(), 'public/uploads/thumbnails')
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    return NextResponse.json({ url: `/uploads/thumbnails/${filename}` })
}