import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const certifications = await sql`SELECT * FROM certifications ORDER BY issue_date DESC`
    return NextResponse.json(certifications)
  } catch (error) {
    console.error("Error fetching certifications:", error)
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const data = await request.json()
    console.log("Certification creation request data:", data)

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

    // Ensure null values for optional fields if they're empty strings
    const sanitizedData = {
      title: data.title,
      issuer: data.issuer,
      issue_date: data.issue_date,
      expiry_date: data.expiry_date || null,
      description: data.description || null,
    }

    console.log("Sanitized data for SQL insertion:", sanitizedData)

    // Insert data into database with explicit column names and values
    const result = await sql`
      INSERT INTO certifications 
      (title, issuer, issue_date, expiry_date, description)
      VALUES (
        ${sanitizedData.title}, 
        ${sanitizedData.issuer}, 
        ${sanitizedData.issue_date}, 
        ${sanitizedData.expiry_date}, 
        ${sanitizedData.description}
      )
      RETURNING *
    `

    console.log("Certification created successfully:", result[0])
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating certification:", error)

    // Provide more specific error messages for common database errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Detailed error message:", errorMessage)

    if (errorMessage.includes("duplicate key")) {
      return NextResponse.json({ error: "A certification with this title already exists" }, { status: 409 })
    }

    if (errorMessage.includes("violates foreign key constraint")) {
      return NextResponse.json({ error: "Invalid reference to another entity" }, { status: 400 })
    }

    if (errorMessage.includes("invalid input syntax")) {
      return NextResponse.json({ error: "Invalid data format provided" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create certification: " + errorMessage }, { status: 500 })
  }
}
