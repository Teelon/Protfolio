import { notFound } from "next/navigation"
import { getProjectBySlug, getProjectById } from "@/lib/db"
import { ProjectForm } from "@/components/projects/project-form"

export const revalidate = 0

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  // Special case for "new" - this should never happen as we have a dedicated route
  // But adding this as a safeguard
  if (params.slug === "new") {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
        <ProjectForm mode="create" />
      </div>
    )
  }

  // Try to get project by slug first
  let project = await getProjectBySlug(params.slug)

  // If not found by slug, try by ID (for drafts without slugs)
  if (!project && !isNaN(Number(params.slug))) {
    project = await getProjectById(Number(params.slug))
  }

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <ProjectForm project={project} mode="edit" />
    </div>
  )
}
