import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params

    try {
        const registration = await prisma.registration.findFirst({ 
            where: { id },
            include: {
                event: {
                    select: {
                        title: true,
                        slug: true,
                        location: true,
                        date: true
                    }
                },
                major: {
                    select: { name: true }
                }
            }
        })

        if (!registration) return NextResponse.json({ message: 'Registration not found' }, { status: 404 })

        const { qrCode, cancelToken, status, attendance, ...rest } = registration

        const response: any = {
            ...rest,
            status,
            attendance,
            event: registration.event,
            major: registration.major
        }

        if (status === 'APPROVED' && attendance === 'ABSENT') {
            response.qrCode = qrCode
        }

        if (status !== 'CANCELLED' && status !== 'REJECTED' && attendance === 'ABSENT') {
            response.cancelToken = cancelToken
        }

        return NextResponse.json(response)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params

    try {
        const { status, attendance } = await req.json()

        const registration = await prisma.registration.update({ 
            where: { id },
            data: { status, attendance },
            select: { status: true, attendance: true }
        })
        return NextResponse.json(registration)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params
    
    try {
        await prisma.registration.delete({ where: { id } })
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}