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
import { MoreHorizontal, Star, ExternalLink, Pencil, Trash2 } from "lucide-react"
import type { Project } from "@/types/project"
import { deleteProjectAction } from "@/app/actions/project-actions"

interface ProjectsTableProps {
  initialProjects: Project[]
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isDeleting, setIsDeleting] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const handleDelete = async () => {
    if (!projectToDelete?.slug) return

    try {
      setIsDeleting(true)

      // Use the server action instead of direct API call
      const result = await deleteProjectAction(projectToDelete.slug)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete project")
      }

      // Update local state to remove the deleted project
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

  return (
    <>
      <div className="rounded-md border">
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

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project &quot;{projectToDelete?.title}&quot;. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Client-side date formatting function to avoid importing from lib/db
function formatDateClient(date: string | Date | null): string {
  if (!date) return "N/A"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}
