"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Star, ExternalLink, Pencil, Trash2, Calendar } from "lucide-react"
import type { Project } from "@/types/project"
import { deleteProjectAction } from "@/app/actions/project-actions"

interface ProjectsTableProps {
  initialProjects: Project[]
}

const formatDateClient = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isDeleting, setIsDeleting] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const handleDelete = async () => {
    if (!projectToDelete?.slug) return

    try {
      setIsDeleting(true)
      const result = await deleteProjectAction(projectToDelete.slug)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete project")
      }

      setProjects(projects.filter((p) => p.id !== projectToDelete.id))
      toast({
        title: "Project deleted",
        description: `${projectToDelete.title} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setProjectToDelete(null)
    }
  }

  // Mobile card view component
  const MobileProjectCard = ({ project }: { project: Project }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {project.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              <h3 className="font-medium">{project.title}</h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDateClient(project.start_date)} - {project.end_date ? formatDateClient(project.end_date) : "Present"}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.technologies?.slice(0, 2).map((tech, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies && project.technologies.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{project.technologies.length - 2}
                </Badge>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              {project.slug && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${project.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/manage-projects/${project.slug || project.id}`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => setProjectToDelete(project)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Badge variant={project.slug ? "outline" : "secondary"} className={
            project.slug 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-amber-50 text-amber-700 border-amber-200"
          }>
            {project.slug ? "Published" : "Draft"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {project.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />}
                      {project.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.slug ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDateClient(project.start_date)} -{" "}
                    {project.end_date ? formatDateClient(project.end_date) : "Present"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies &&
                        project.technologies.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {project.slug && (
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/manage-projects/${project.slug || project.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setProjectToDelete(project)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="h-24 flex items-center justify-center text-muted-foreground">
              No projects found.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <MobileProjectCard key={project.id} project={project} />
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => !isDeleting && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project &quot;{projectToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
