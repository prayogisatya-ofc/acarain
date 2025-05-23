import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireAdmin(req)
    if (error) return error

    const { id } = await params

    try {
        const registration = await prisma.registration.update({
            where: { id }, 
            data: { status: 'APPROVED' }
        })
        return NextResponse.json(registration)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}