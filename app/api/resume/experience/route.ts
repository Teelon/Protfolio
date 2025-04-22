import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const experiences = await sql`SELECT * FROM experience ORDER BY start_date DESC`

    return NextResponse.json(experiences)
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const result = await sql`
      INSERT INTO experience 
      (position, company, location, employment_type, start_date, end_date, current, description)
      VALUES (
        ${data.position}, 
        ${data.company}, 
        ${data.location}, 
        ${data.employment_type}, 
        ${data.start_date}, 
        ${data.end_date}, 
        ${data.current || false}, 
        ${data.description || []}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}
