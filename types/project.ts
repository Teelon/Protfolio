export interface Project {
  id: number
  title: string
  slug: string | null
  summary: string | null
  description: string[] | null
  role: string | null
  goal: string | null
  image_url: string | null
  demo_url: string | null
  github_url: string | null
  technologies: string[] | null
  skills: string[] | null
  tools: string[] | null
  tags: string[] | null
  start_date: string | null // ISO date string
  end_date: string | null // ISO date string
  featured: boolean
  organization: string | null
  created_at: string | null // ISO datetime string
  updated_at: string | null // ISO datetime string
}

export type ProjectFormData = Omit<Project, "id" | "created_at" | "updated_at">
