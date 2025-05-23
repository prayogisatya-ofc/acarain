import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params

    try {
        const admin = await prisma.admin.findUnique({
            where: { id }, 
            select: {
                id: true, 
                name: true, 
                email: true, 
                createdAt: true, 
                updatedAt: true 
            }
        })
        return NextResponse.json(admin)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params
    const { name, email, password } = await req.json()
    const data: any = {}
    if (name) data.name = name
    if (email) data.email = email
    if (password) data.password = await bcrypt.hash(password, 10)

    try {
        const updated = await prisma.admin.update({ where: { id }, data })
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
        await prisma.admin.delete({ where: { id } })
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}