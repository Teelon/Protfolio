import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const experience = await sql`SELECT * FROM experience WHERE id = ${id}`

    if (experience.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(experience[0])
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    const result = await sql`
      UPDATE experience 
      SET position = ${data.position}, 
          company = ${data.company}, 
          location = ${data.location}, 
          employment_type = ${data.employment_type},
          start_date = ${data.start_date}, 
          end_date = ${data.end_date}, 
          current = ${data.current || false}, 
          description = ${data.description || []}, 
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await sql`DELETE FROM experience WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Experience deleted successfully" })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
