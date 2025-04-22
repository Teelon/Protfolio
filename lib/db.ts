// This file contains database operations and utility functions
// Only import the database operations in server components

import { neon } from "@neondatabase/serverless"
import type { Project } from "@/types/project"

// Initialize the database connection using the Neon serverless client
// This should only be used in server components or server actions
export const sql = neon(process.env.DATABASE_URL)

/**
 * Format a date for display
 * This is a utility function that can be used on both client and server
 */
export function formatDate(date: string | Date | null): string {
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

/**
 * Sanitize project data for database operations
 * This is a utility function that can be used on both client and server
 */
export function sanitizeProjectData(project: Partial<Project>) {
  return {
    ...project,
    title: project.title || null,
    slug: project.slug || null,
    summary: project.summary || null,
    description: Array.isArray(project.description) ? project.description.filter(Boolean) : [],
    role: project.role || null,
    goal: project.goal || null,
    image_url: project.image_url || null,
    demo_url: project.demo_url || null,
    github_url: project.github_url || null,
    technologies: Array.isArray(project.technologies) ? project.technologies.filter(Boolean) : [],
    skills: Array.isArray(project.skills) ? project.skills.filter(Boolean) : [],
    tools: Array.isArray(project.tools) ? project.tools.filter(Boolean) : [],
    tags: Array.isArray(project.tags) ? project.tags.filter(Boolean) : [],
    start_date: project.start_date || null,
    end_date: project.end_date || null,
    featured: Boolean(project.featured),
    organization: project.organization || null,
  }
}

// The following functions are database operations and should only be used in server components or actions

/**
 * Get all projects with optional filtering
 */
export async function getProjects(
  options: {
    featured?: boolean
    limit?: number
    withFullDetails?: boolean
  } = {},
) {
  try {
    let baseQuery

    if (options.withFullDetails) {
      baseQuery = sql`SELECT * FROM projects`
    } else {
      baseQuery = sql`SELECT id, title, slug, summary, image_url, demo_url, github_url, 
        technologies, skills, tags, featured, start_date, end_date, organization 
        FROM projects`
    }

    // Add WHERE clause if featured filter is provided
    if (options.featured !== undefined) {
      baseQuery = sql`${baseQuery} WHERE featured = ${options.featured}`
    }

    // Add ORDER BY
    baseQuery = sql`${baseQuery} ORDER BY featured DESC, start_date DESC NULLS LAST`

    // Add LIMIT if provided
    if (options.limit) {
      baseQuery = sql`${baseQuery} LIMIT ${options.limit}`
    }

    const projects = await baseQuery
    return projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string | null): Promise<Project | null> {
  try {
    if (!slug || slug === "null" || slug === "undefined" || slug === "new") {
      return null
    }

    const projects = await sql<Project[]>`SELECT * FROM projects WHERE slug = ${slug}`
    return projects.length > 0 ? projects[0] : null
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error)
    return null
  }
}

/**
 * Get a single project by ID
 */
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const projects = await sql<Project[]>`SELECT * FROM projects WHERE id = ${id}`
    return projects.length > 0 ? projects[0] : null
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error)
    return null
  }
}

/**
 * Create a new project
 */
export async function createProject(projectData: Partial<Project>): Promise<Project | null> {
  try {
    const data = sanitizeProjectData(projectData)

    const result = await sql<Project[]>`
      INSERT INTO projects (
        title, slug, summary, description, role, goal, image_url, 
        demo_url, github_url, technologies, skills, tools, tags,
        start_date, end_date, featured, organization
      )
      VALUES (
        ${data.title},
        ${data.slug},
        ${data.summary},
        ${data.description},
        ${data.role},
        ${data.goal},
        ${data.image_url},
        ${data.demo_url},
        ${data.github_url},
        ${data.technologies},
        ${data.skills},
        ${data.tools},
        ${data.tags},
        ${data.start_date},
        ${data.end_date},
        ${data.featured},
        ${data.organization}
      )
      RETURNING *
    `

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error creating project:", error)
    return null
  }
}

/**
 * Update an existing project
 */
export async function updateProject(slug: string, projectData: Partial<Project>): Promise<Project | null> {
  try {
    if (!slug || slug === "null" || slug === "undefined") {
      return null
    }

    const data = sanitizeProjectData(projectData)

    const result = await sql<Project[]>`
      UPDATE projects 
      SET 
        title = COALESCE(${data.title}, title),
        slug = COALESCE(${data.slug}, slug),
        summary = ${data.summary},
        description = ${data.description},
        role = ${data.role},
        goal = ${data.goal},
        image_url = ${data.image_url},
        demo_url = ${data.demo_url},
        github_url = ${data.github_url},
        technologies = ${data.technologies},
        skills = ${data.skills},
        tools = ${data.tools},
        tags = ${data.tags},
        start_date = ${data.start_date},
        end_date = ${data.end_date},
        featured = ${data.featured},
        organization = ${data.organization},
        updated_at = NOW()
      WHERE slug = ${slug}
      RETURNING *
    `

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error updating project with slug ${slug}:`, error)
    return null
  }
}

/**
 * Delete a project
 */
export async function deleteProject(slug: string): Promise<boolean> {
  try {
    if (!slug || slug === "null" || slug === "undefined") {
      return false
    }

    const result = await sql`DELETE FROM projects WHERE slug = ${slug} RETURNING id`
    return result.length > 0
  } catch (error) {
    console.error(`Error deleting project with slug ${slug}:`, error)
    return false
  }
}

/**
 * Generate slugs for projects that don't have them
 */
export async function generateMissingSlugs(): Promise<{ count: number; projects: Partial<Project>[] }> {
  try {
    const slugify = (text: string) => {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
    }

    // Get all projects without slugs
    const projectsWithoutSlugs = await sql<Project[]>`
      SELECT id, title FROM projects 
      WHERE slug IS NULL OR slug = ''
    `

    if (projectsWithoutSlugs.length === 0) {
      return { count: 0, projects: [] }
    }

    const updatedProjects: Partial<Project>[] = []

    // Update each project with a generated slug
    for (const project of projectsWithoutSlugs) {
      if (!project.title) continue

      // Generate base slug
      const baseSlug = slugify(project.title)
      let slug = baseSlug
      let counter = 1

      // Check if slug exists and generate a unique one if needed
      let slugExists = true
      while (slugExists) {
        const existing = await sql`SELECT id FROM projects WHERE slug = ${slug} AND id != ${project.id}`
        if (existing.length === 0) {
          slugExists = false
        } else {
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }

      // Update the project with the new slug
      await sql`UPDATE projects SET slug = ${slug} WHERE id = ${project.id}`
      updatedProjects.push({ id: project.id, title: project.title, slug })
    }

    return { count: updatedProjects.length, projects: updatedProjects }
  } catch (error) {
    console.error("Error generating slugs:", error)
    return { count: 0, projects: [] }
  }
}
