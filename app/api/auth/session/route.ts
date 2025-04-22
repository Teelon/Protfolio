import { auth } from "@/auth"
import { NextResponse } from "next/server"

// Disable edge runtime for session endpoint
export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  return NextResponse.json({ user: session?.user || null })
}
