import { notFound } from "next/navigation"
import { getProjectBySlug } from "@/lib/db"
import { ProjectForm } from "@/components/projects/project-form"

export const revalidate = 0

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)

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
