import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { EducationForm } from "@/components/resume/education-form"

export const revalidate = 0

async function getEducation(id: string) {
  // If the ID is "new", we're creating a new education entry, not fetching an existing one
  if (id === "new") {
    return null
  }

  try {
    // Ensure id is a valid integer before querying
    const numericId = Number.parseInt(id, 10)
    if (isNaN(numericId)) {
      return null
    }

    const education = await sql`SELECT * FROM education WHERE id = ${numericId}`

    if (education.length === 0) {
      return null
    }

    return education[0]
  } catch (error) {
    console.error("Error fetching education:", error)
    return null
  }
}

export default async function EditEducationPage({ params }: { params: { id: string } }) {
  // If the ID is "new", we're creating a new education entry
  if (params.id === "new") {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Add Education</h1>
        <EducationForm mode="create" />
      </div>
    )
  }

  const education = await getEducation(params.id)

  if (!education) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Education</h1>
      <EducationForm education={education} mode="edit" />
    </div>
  )
}
