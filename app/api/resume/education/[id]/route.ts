import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const education = await sql`SELECT * FROM education WHERE id = ${id}`

    if (education.length === 0) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 })
    }

    return NextResponse.json(education[0])
  } catch (error) {
    console.error("Error fetching education:", error)
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    const result = await sql`
      UPDATE education 
      SET degree = ${data.degree}, 
          institution = ${data.institution}, 
          location = ${data.location}, 
          start_date = ${data.start_date}, 
          end_date = ${data.end_date}, 
          gpa = ${data.gpa}, 
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating education:", error)
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await sql`DELETE FROM education WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Education deleted successfully" })
  } catch (error) {
    console.error("Error deleting education:", error)
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 })
  }
}
