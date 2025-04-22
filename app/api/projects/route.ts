import { NextResponse } from "next/server"
import { getProjects } from "@/lib/db"

// This route is now only used for reading projects
// All mutations are handled by server actions
export async function GET() {
  try {
    const projects = await getProjects({ withFullDetails: true })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
