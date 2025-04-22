"use server"

import { revalidatePath } from "next/cache"
import { deleteProject, createProject, updateProject } from "@/lib/db"
import type { ProjectFormData } from "@/types/project"
import slugify from "slugify"

/**
 * Server action to delete a project
 * This keeps database operations on the server and prevents
 * environment variables from being exposed to the client
 */
export async function deleteProjectAction(slug: string) {
  try {
    if (!slug) {
      return { success: false, error: "Invalid project slug" }
    }

    const success = await deleteProject(slug)

    if (!success) {
      return { success: false, error: "Project not found or could not be deleted" }
    }

    // Revalidate the projects page to reflect the changes
    revalidatePath("/admin/manage-projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    }
  }
}

/**
 * Server action to create a new project
 */
export async function createProjectAction(data: ProjectFormData) {
  try {
    // Validate required fields
    if (!data.title) {
      return { success: false, error: "Title is required" }
    }

    // Generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true })
    }

    const project = await createProject(data)

    if (!project) {
      return { success: false, error: "Failed to create project" }
    }

    // Revalidate the projects page to reflect the changes
    revalidatePath("/admin/manage-projects")
    revalidatePath("/projects")

    return { success: true, project }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    }
  }
}

/**
 * Server action to update an existing project
 */
export async function updateProjectAction(slug: string, data: ProjectFormData) {
  try {
    if (!slug) {
      return { success: false, error: "Invalid project slug" }
    }

    // Validate required fields
    if (!data.title) {
      return { success: false, error: "Title is required" }
    }

    // Generate new slug if title changed and slug not provided
    if (!data.slug && data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true })
    }

    const project = await updateProject(slug, data)

    if (!project) {
      return { success: false, error: "Project not found or update failed" }
    }

    // Revalidate the projects page to reflect the changes
    revalidatePath("/admin/manage-projects")
    revalidatePath(`/projects/${project.slug}`)
    revalidatePath("/projects")

    return { success: true, project }
  } catch (error) {
    console.error("Error updating project:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    }
  }
}
