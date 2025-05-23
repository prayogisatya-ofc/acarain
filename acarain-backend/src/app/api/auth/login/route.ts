import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
    const { email, password } = await request.json()
    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    
    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" })
    return NextResponse.json({ token })
}
