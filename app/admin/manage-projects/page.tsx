import { getProjects } from "@/lib/db"
import { ProjectsTable } from "@/components/projects/projects-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const revalidate = 0

export default async function ManageProjectsPage() {
  // This is a server component, so database operations are safe here
  const projects = await getProjects()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button asChild>
          <Link href="/admin/manage-projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  )
}
