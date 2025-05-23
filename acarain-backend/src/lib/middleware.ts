import { NextResponse, NextRequest } from "next/server"
import { verifyAdminToken } from "./auth"

export function requireAdmin(req: NextRequest) {
    const auth = req.headers.get("Authorization")
    if (!auth || !auth.startsWith("Bearer ")) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }), admin: null }

    const token = auth.split(' ')[1]
    const admin = verifyAdminToken(token)

    if (!admin) return { error: NextResponse.json({ message: "Invalid token" }, { status: 401 }), admin: null }

    return { error: null, admin }
}