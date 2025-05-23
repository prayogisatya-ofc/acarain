import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const events = await prisma.event.findMany({
        select: {
            id: true,
            title: true,
            thumbnail: true,
            date: true,
            quota: true,
            slug: true,
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