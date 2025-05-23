import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"
import slugify from "slugify"

export async function GET(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    const events = await prisma.event.findMany({
        select: {
            id: true,
            title: true,
            location: true,
            date: true,
            quota: true,
            registrations: {
                where: { status: 'APPROVED' },
                select: { id: true }
            }
        },
        orderBy: { createdAt: "desc" },
    })

    const eventsWithQuota = events.map(event => ({
        ...event,
        currentQuota: event.quota - event.registrations.length,
        totalRegistered: event.registrations.length
    }))
    return NextResponse.json(eventsWithQuota)
}

export async function POST(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    try {
        const {
            title,
            description,
            location,
            date,
            quota,
            thumbnail
        } = await req.json().then(data => data.form)

        const slug = slugify(title, { lower: true, strict: true })

        const exists = await prisma.event.findUnique({ where: { slug } })
        if (exists) return NextResponse.json({ message: "Slug already exists, use different title" }, { status: 400 })

        const event = await prisma.event.create({
            data: {
                title,
                slug,
                description,
                location,
                date: new Date(date),
                quota: Number(quota),
                thumbnail
            } 
        })

        return NextResponse.json(event, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}