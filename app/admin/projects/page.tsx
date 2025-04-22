import Link from "next/link"
import { getProjects, formatDate } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ExternalLink, Star, Calendar } from "lucide-react"
import type { Project } from "@/types/project"
import { GenerateSlugsButton } from "@/components/projects/generate-slugs-button"

export const revalidate = 0

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <div className="flex gap-2">
          <GenerateSlugsButton />
          <Button asChild>
            <Link href="/admin/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Link>
          </Button>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6">
          {projects.map((project: Project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {project.image_url && (
                  <div className="w-full md:w-48 h-32 bg-muted relative">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {project.title}
                        {project.featured && <Star className="ml-2 h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : "Present"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      {project.slug && (
                        <Button variant="ghost" size="sm" asChild className="mr-2">
                          <Link href={`/projects/${project.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.summary && <p className="text-muted-foreground line-clamp-2">{project.summary}</p>}
                  </CardContent>
                  <CardFooter className="mt-auto">
                    {project.slug ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/projects/${project.slug}`}>Edit Project</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Missing Slug
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button asChild>
              <Link href="/admin/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
