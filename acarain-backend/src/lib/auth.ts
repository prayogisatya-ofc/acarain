import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export function verifyAdminToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
        return decoded
    } catch (error) {
        return null
    }
}