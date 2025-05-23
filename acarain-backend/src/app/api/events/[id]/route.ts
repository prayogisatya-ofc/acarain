import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params

    try {
        const event = await prisma.event.findFirst({ 
            where: { id },
            include: {
                registrations: {
                    include: {
                        major: {
                            select: { name: true }
                        }
                    }
                }
            }
        })

        if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 })

        const eventWithQuota = {
            ...event,
            currentQuota: event.quota - event.registrations.length,
            totalRegistered: event.registrations.length
        }

        return NextResponse.json(eventWithQuota)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}