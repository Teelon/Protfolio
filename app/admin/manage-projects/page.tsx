import { getProjects } from "@/lib/db"
import { ProjectsTable } from "@/components/projects/projects-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const revalidate = 0

export default async function ManageProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Projects</h1>
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
