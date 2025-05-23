import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"

export async function GET(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code) return NextResponse.json({ message: "Code required" }, { status: 400 })

    try {
        const reg = await prisma.registration.findUnique({ 
            where: { qrCode: code },
            select: {
                name: true,
                npm: true,
                whatsapp: true,
                major: { select: { name: true } },
                attendance: true,
                status: true
            }
        })
        if (!reg) return NextResponse.json({ message: "Registration not found" }, { status: 404 })

        return NextResponse.json(reg)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code) return NextResponse.json({ message: "Code required" }, { status: 400 })

    try {
        const reg = await prisma.registration.findUnique({ where: { qrCode: code } })
        if (!reg || reg.status === 'REJECTED' || reg.status === 'CANCELLED') return NextResponse.json({ message: "Registration has been rejected or cancelled" }, { status: 403 })

        if (reg.attendance === 'ATTENDED') return NextResponse.json({ message: "Registration already attended" }, { status: 403 })

        await prisma.registration.update({
            where: { qrCode: code, status: 'APPROVED' }, 
            data: { attendance: 'ATTENDED' }
        })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}