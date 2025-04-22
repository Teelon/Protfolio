import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const education = await sql`SELECT * FROM education ORDER BY start_date DESC`

    return NextResponse.json(education)
  } catch (error) {
    console.error("Error fetching education:", error)
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const result = await sql`
      INSERT INTO education 
      (degree, institution, location, start_date, end_date, gpa)
      VALUES (
        ${data.degree}, 
        ${data.institution}, 
        ${data.location}, 
        ${data.start_date}, 
        ${data.end_date}, 
        ${data.gpa}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating education:", error)
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 })
  }
}
