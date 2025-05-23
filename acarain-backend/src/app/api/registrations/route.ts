import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"
import { nanoid } from "nanoid"

export async function GET(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    const registrations = await prisma.registration.findMany()
    return NextResponse.json(registrations)
}

export async function POST(req: NextRequest) {
    try {
        const { name, npm, majorId, whatsapp, eventId } = await req.json()

        const cancelToken = nanoid(24)
        const qrCode = nanoid(32)

        const registration = await prisma.registration.create({ 
            data: {
                name,
                npm,
                majorId,
                whatsapp,
                eventId,
                cancelToken,
                qrCode
            }
        })
        return NextResponse.json({ id: registration.id }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}