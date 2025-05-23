import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const profile = await sql`SELECT * FROM resume_profile ORDER BY id LIMIT 1`

    return NextResponse.json(profile[0] || {})
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()

    const result = await sql`
      UPDATE resume_profile 
      SET name = ${data.name}, 
          location = ${data.location}, 
          phone = ${data.phone}, 
          email = ${data.email}, 
          linkedin = ${data.linkedin}, 
          github_link = ${data.github_link},
          title = ${data.title}, 
          summary = ${data.summary},
          bio_photo = ${data.bio_photo},
          updated_at = NOW()
      WHERE id = ${data.id}
      RETURNING *
    `

    if (result.length === 0) {
      // If no record was updated, insert a new one
      const newProfile = await sql`
        INSERT INTO resume_profile 
        (name, location, phone, email, linkedin, github_link, title, summary, bio_photo)
        VALUES (${data.name}, ${data.location}, ${data.phone}, ${data.email}, ${data.linkedin}, ${data.github_link}, ${data.title}, ${data.summary}, ${data.bio_photo})
        RETURNING *
      `
      return NextResponse.json(newProfile[0])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
