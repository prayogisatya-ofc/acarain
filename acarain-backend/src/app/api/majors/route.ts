import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"

export async function GET(req: NextRequest) {
    const majors = await prisma.major.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(majors)
}

export async function POST(req: NextRequest) {
    const { error } = requireAdmin(req)
    if (error) return error

    try {
        const { name } = await req.json()
        const major = await prisma.major.create({ data: { name } })
        return NextResponse.json(major, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}