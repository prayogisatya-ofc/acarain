import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"
import slugify from "slugify"
import path from "path"
import fs from "fs/promises"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error
    
    const { id } = await params

    try {
        const event = await prisma.event.findFirst({ 
            where: { id } 
        })

        return NextResponse.json(event)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params

    try {
        const {
            title,
            description,
            location,
            date,
            quota,
            thumbnail
        } = await req.json()

        const slug = slugify(title, { lower: true, strict: true })

        const exists = await prisma.event.findFirst({ 
            where: { 
                slug, 
                NOT: { id }
            } 
        })
        if (exists) return NextResponse.json({ message: "Slug already exists, use different title" }, { status: 400 })

        const updated = await prisma.event.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                location,
                date: new Date(date),
                quota: Number(quota),
                thumbnail: thumbnail ?? ''
            } 
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params
    
    try {
        const event = await prisma.event.findUnique({ where: { id } })
        if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 })
        
        await prisma.event.delete({ where: { id } })

        if (event.thumbnail) {
            try {
                const filePath = path.join(process.cwd(), 'public', event.thumbnail)
                await fs.unlink(filePath)
            } catch (err) {
                console.warn('Failed to delete thumbnail', err)
            }
        }
        
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}