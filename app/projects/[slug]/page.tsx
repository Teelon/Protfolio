import { getProjectBySlug, formatDate } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github, Calendar, ArrowLeft, Briefcase, Target, Code, Wrench, Tags, Star } from "lucide-react"

export const revalidate = 0

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          {/* Project Header */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.featured && (
              <Badge variant="default" className="bg-primary text-primary-foreground">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
            {project.tags &&
              project.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
          </div>

          <h1 className="text-4xl font-bold mb-2">{project.title}</h1>

          {project.organization && <p className="text-xl text-muted-foreground mb-4">{project.organization}</p>}

          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : "Present"}
            </span>
          </div>
        </div>

        {/* Hero Image */}
        {project.image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-10">
            <Image
              src={project.image_url || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 mb-10">
          {project.demo_url && (
            <Button asChild>
              <Link href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                View Live Demo
              </Link>
            </Button>
          )}

          {project.github_url && (
            <Button variant="outline" asChild>
              <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                View Code
              </Link>
            </Button>
          )}
        </div>

        {/* Summary */}
        {project.summary && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-lg leading-relaxed">{project.summary}</p>
          </div>
        )}

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Role */}
          {project.role && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Briefcase className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">Role</h3>
                </div>
                <p>{project.role}</p>
              </CardContent>
            </Card>
          )}

          {/* Goal */}
          {project.goal && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Target className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">Goal</h3>
                </div>
                <p>{project.goal}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Description */}
        {project.description && project.description.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-4 text-base leading-relaxed">
              {project.description.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Code className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">Technologies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tools */}
          {project.tools && project.tools.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Wrench className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">Tools</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool: string) => (
                    <Badge key={tool} variant="outline">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Tags className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Skills Applied</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-base py-1.5 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects - Placeholder for future enhancement */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Related projects would go here */}
        {/* </div> */}

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t">
          <Button variant="outline" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Projects
            </Link>
          </Button>

          <div className="flex gap-4">
            {project.demo_url && (
              <Button variant="default" size="sm" asChild>
                <Link href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Demo
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
