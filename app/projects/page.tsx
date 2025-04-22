import { getProjects } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import type { Project } from "@/types/project"

export const revalidate = 0

export default async function ProjectsPage() {
  const projects = (await getProjects()) as Project[]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Projects</h1>
        <p className="text-xl text-muted-foreground mb-12">Explore my data analytics projects and case studies.</p>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-12">
            {projects.map((project: Project) => (
              <div key={project.id} className="group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Project Image */}
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    {project.image_url ? (
                      <Image
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="flex flex-col h-full">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.featured && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      )}
                      {project.tags &&
                        project.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">{project.title}</h2>

                    {project.summary && <p className="text-muted-foreground mb-4">{project.summary}</p>}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild={!!project.github_url}
                        disabled={!project.github_url}
                        className="flex items-center"
                      >
                        {project.github_url ? (
                          <Link
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            Code
                          </Link>
                        ) : (
                          <span className="flex items-center">
                            <Github className="mr-2 h-4 w-4" />
                            Code
                          </span>
                        )}
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild={!!project.slug}
                        disabled={!project.slug}
                      >
                        {project.slug ? (
                          <Link href={`/projects/${project.slug}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Project Details
                          </Link>
                        ) : (
                          <span className="flex items-center">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Project Details
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
