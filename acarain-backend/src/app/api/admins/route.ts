import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    const admins = await prisma.admin.findMany({
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(admins)
}

export async function POST(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    try {
        const { name, email, password } = await req.json()

        const exists = await prisma.admin.findUnique({ where: { email } })
        if (exists) return NextResponse.json({ message: "Email already exists" }, { status: 400 })

        const hashed = await bcrypt.hash(password, 10)
        
        const admin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashed
            }
        })

        return NextResponse.json({
            id: admin.id, 
            name: admin.name, 
            email: admin.email, 
            createdAt: admin.createdAt, 
            updatedAt: admin.updatedAt
        }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}