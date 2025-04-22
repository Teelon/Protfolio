import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const users = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    return NextResponse.json({
      exists: users.length > 0,
    })
  } catch (error) {
    console.error("Error checking email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
