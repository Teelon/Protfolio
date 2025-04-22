import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { CertificationForm } from "@/components/resume/certification-form"

export const revalidate = 0

async function getCertification(id: string) {
  // If the ID is "new", we're creating a new certification, not fetching an existing one
  if (id === "new") {
    return null
  }

  try {
    // Ensure id is a valid integer before querying
    const numericId = Number.parseInt(id, 10)
    if (isNaN(numericId)) {
      return null
    }

    const certification = await sql`SELECT * FROM certifications WHERE id = ${numericId}`

    if (certification.length === 0) {
      return null
    }

    return certification[0]
  } catch (error) {
    console.error("Error fetching certification:", error)
    return null
  }
}

export default async function EditCertificationPage({ params }: { params: { id: string } }) {
  // If the ID is "new", we're creating a new certification
  if (params.id === "new") {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Add Certification</h1>
        <CertificationForm mode="create" />
      </div>
    )
  }

  const certification = await getCertification(params.id)

  if (!certification) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Certification</h1>
      <CertificationForm certification={certification} mode="edit" />
    </div>
  )
}
