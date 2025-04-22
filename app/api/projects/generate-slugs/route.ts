import { NextResponse } from "next/server"
import { generateMissingSlugs } from "@/lib/db"

export async function POST() {
  try {
    const result = await generateMissingSlugs()

    return NextResponse.json({
      message: `Updated ${result.count} projects with generated slugs`,
      updatedProjects: result.projects,
    })
  } catch (error) {
    console.error("Error generating slugs:", error)
    return NextResponse.json({ error: "Failed to generate slugs" }, { status: 500 })
  }
}
