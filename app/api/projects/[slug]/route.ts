import { NextResponse } from "next/server"
import { getProjectBySlug } from "@/lib/db"

// This route is now only used for reading a specific project
// All mutations are handled by server actions
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    if (!slug || slug === "null" || slug === "undefined") {
      return NextResponse.json({ error: "Invalid slug provided" }, { status: 400 })
    }

    const project = await getProjectBySlug(slug)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
