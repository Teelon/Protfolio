import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { ExperienceForm } from "@/components/resume/experience-form"

export const revalidate = 0

async function getExperience(id: string) {
  // If the ID is "new", we're creating a new experience, not fetching an existing one
  if (id === "new") {
    return null
  }

  try {
    // Ensure id is a valid integer before querying
    const numericId = Number.parseInt(id, 10)
    if (isNaN(numericId)) {
      return null
    }

    const experience = await sql`SELECT * FROM experience WHERE id = ${numericId}`

    if (experience.length === 0) {
      return null
    }

    return experience[0]
  } catch (error) {
    console.error("Error fetching experience:", error)
    return null
  }
}

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  // If the ID is "new", we're creating a new experience
  if (params.id === "new") {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Add Experience</h1>
        <ExperienceForm mode="create" />
      </div>
    )
  }

  const experience = await getExperience(params.id)

  if (!experience) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Experience</h1>
      <ExperienceForm experience={experience} mode="edit" />
    </div>
  )
}
