import { NextRequest, NextResponse } from "next/server"
import { serialize } from "cookie"

export async function POST(req: NextRequest) {
  const expiredToken = serialize("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  })

  return new NextResponse(
    JSON.stringify({ message: "Logout berhasil" }),
    {
      status: 200,
      headers: {
        "Set-Cookie": expiredToken,
        "Content-Type": "application/json",
      },
    }
  )
}
