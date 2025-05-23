import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {

    const { slug } = await params

    try {
        const event = await prisma.event.findFirst({ 
            where: { slug },
            include: {
                registrations: {
                    where: { status: 'APPROVED' },
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