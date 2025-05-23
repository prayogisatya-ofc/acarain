import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) return NextResponse.json({ message: "Token required" }, { status: 400 })

    try {
        await prisma.registration.update({
            where: { cancelToken: token }, 
            data: { status: 'CANCELLED' }
        })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}