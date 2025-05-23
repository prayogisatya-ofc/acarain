import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params

    try {
        const major = await prisma.major.findUnique({ where: { id } })
        return NextResponse.json(major)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params
    const { name } = await req.json()

    try {
        const updated = await prisma.major.update({ where: { id }, data: { name } })
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
        await prisma.major.delete({ where: { id } })
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}