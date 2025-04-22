import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get("slug")
    const currentSlug = url.searchParams.get("currentSlug") // For edit mode

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    // In edit mode, if the slug hasn't changed, it's valid
    if (currentSlug && slug === currentSlug) {
      return NextResponse.json({ available: true })
    }

    const result = await sql`SELECT id FROM projects WHERE slug = ${slug}`
    const available = result.length === 0

    return NextResponse.json({ available })
  } catch (error) {
    console.error("Error checking slug availability:", error)
    return NextResponse.json({ error: "Failed to check slug availability" }, { status: 500 })
  }
}