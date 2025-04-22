import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate ID parameter
    const id = Number.parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid certification ID" }, { status: 400 })
    }

    const certification = await sql`SELECT * FROM certifications WHERE id = ${id}`

    if (certification.length === 0) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 })
    }

    return NextResponse.json(certification[0])
  } catch (error) {
    console.error("Error fetching certification:", error)
    return NextResponse.json({ error: "Failed to fetch certification" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate ID parameter
    const id = Number.parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid certification ID" }, { status: 400 })
    }

    // Parse and validate request body
    const data = await request.json()

    // Validate required fields
    if (!data.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!data.issuer?.trim()) {
      return NextResponse.json({ error: "Issuer is required" }, { status: 400 })
    }

    if (!data.issue_date) {
      return NextResponse.json({ error: "Issue date is required" }, { status: 400 })
    }

    // Validate date formats
    try {
      if (data.issue_date) new Date(data.issue_date)
      if (data.expiry_date) new Date(data.expiry_date)
    } catch (e) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    // Validate date logic
    if (data.issue_date && data.expiry_date && new Date(data.issue_date) > new Date(data.expiry_date)) {
      return NextResponse.json({ error: "Expiry date cannot be before issue date" }, { status: 400 })
    }

    const result = await sql`
      UPDATE certifications 
      SET title = ${data.title}, 
          issuer = ${data.issuer}, 
          issue_date = ${data.issue_date}, 
          expiry_date = ${data.expiry_date}, 
          description = ${data.description}, 
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating certification:", error)

    // Provide more specific error messages for common database errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    if (errorMessage.includes("duplicate key")) {
      return NextResponse.json({ error: "A certification with this title already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate ID parameter
    const id = Number.parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid certification ID" }, { status: 400 })
    }

    const result = await sql`DELETE FROM certifications WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Certification deleted successfully" })
  } catch (error) {
    console.error("Error deleting certification:", error)
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 })
  }
}
