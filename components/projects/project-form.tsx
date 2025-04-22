"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Trash2, Plus, Loader2, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import slugify from "slugify"
import type { Project, ProjectFormData } from "@/types/project"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProjectAction, updateProjectAction, deleteProjectAction } from "@/app/actions/project-actions"

interface ProjectFormProps {
  project?: Project
  mode: "create" | "edit"
}

const defaultProject: ProjectFormData = {
  title: "",
  slug: "", // Ensure slug is always a string, never null
  summary: "",
  description: [""],
  role: "",
  goal: "",
  image_url: "",
  demo_url: "",
  github_url: "",
  technologies: [""],
  skills: [""],
  tools: [""],
  tags: [""],
  start_date: "",
  end_date: "",
  featured: false,
  organization: "",
}

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<ProjectFormData>(
    project
      ? {
          title: project.title,
          slug: project.slug || "", // Convert null to empty string
          summary: project.summary || "",
          description: project.description && project.description.length > 0 ? project.description : [""],
          role: project.role || "",
          goal: project.goal || "",
          image_url: project.image_url || "",
          demo_url: project.demo_url || "",
          github_url: project.github_url || "",
          technologies: project.technologies && project.technologies.length > 0 ? project.technologies : [""],
          skills: project.skills && project.skills.length > 0 ? project.skills : [""],
          tools: project.tools && project.tools.length > 0 ? project.tools : [""],
          tags: project.tags && project.tags.length > 0 ? project.tags : [""],
          start_date: project.start_date || "",
          end_date: project.end_date || "",
          featured: project.featured || false,
          organization: project.organization || "",
        }
      : defaultProject,
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  // Generate slug from title
  useEffect(() => {
    if (mode === "create" && formData.title && !formData.slug) {
      const generatedSlug = slugify(formData.title, { lower: true, strict: true })
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when user makes changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Clear general form error when user makes any changes
    if (formError) {
      setFormError(null)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  // Handle array fields (description, technologies, skills, tools, tags)
  const handleArrayChange = (field: keyof ProjectFormData, index: number, value: string) => {
    const newArray = [...(formData[field] as string[])]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: keyof ProjectFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }))
  }

  const removeArrayItem = (field: keyof ProjectFormData, index: number) => {
    const newArray = [...(formData[field] as string[])]
    newArray.splice(index, 1)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setFormError(null)

    try {
      // Filter out empty array items
      const cleanedData = {
        ...formData,
        description: (formData.description as string[]).filter((item: string) => item.trim() !== ""),
        technologies: (formData.technologies as string[]).filter((item: string) => item.trim() !== ""),
        skills: (formData.skills as string[]).filter((item: string) => item.trim() !== ""),
        tools: (formData.tools as string[]).filter((item: string) => item.trim() !== ""),
        tags: (formData.tags as string[]).filter((item: string) => item.trim() !== ""),
      }

      let result

      if (mode === "create") {
        // Use server action to create project
        result = await createProjectAction(cleanedData)
      } else {
        // Use server action to update project
        result = await updateProjectAction(project?.slug || "", cleanedData)
      }

      if (!result.success) {
        throw new Error(result.error || `Failed to ${mode} project`)
      }

      toast({
        title: `Project ${mode === "create" ? "Created" : "Updated"}`,
        description: `Your project has been ${mode === "create" ? "created" : "updated"} successfully.`,
      })

      router.push("/admin/manage-projects")
    } catch (error) {
      console.error(`Error ${mode}ing project:`, error)
      setFormError(error instanceof Error ? error.message : `Failed to ${mode} project. Please try again.`)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} project. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!project?.slug || !confirm("Are you sure you want to delete this project?")) {
      return
    }

    setIsLoading(true)
    setFormError(null)

    try {
      // Use server action to delete project
      const result = await deleteProjectAction(project.slug)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete project")
      }

      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully.",
      })

      router.push("/admin/manage-projects")
    } catch (error) {
      console.error("Error deleting project:", error)
      setFormError(error instanceof Error ? error.message : "Failed to delete project. Please try again.")

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const navigateBack = () => {
    router.push("/admin/manage-projects")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{mode === "create" ? "Add Project" : "Edit Project"}</CardTitle>
          {mode === "edit" && (
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
              Delete
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="media">Media & Links</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className={errors.slug ? "text-destructive" : ""}>
                      Slug *
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug || ""}
                      onChange={handleChange}
                      className={errors.slug ? "border-destructive" : ""}
                    />
                    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                    <p className="text-xs text-muted-foreground">
                      URL-friendly version of the title (auto-generated if left empty)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 flex items-center space-x-2">
                    <Checkbox id="featured" checked={formData.featured} onCheckedChange={handleCheckboxChange} />
                    <label
                      htmlFor="featured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Featured Project
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={formData.summary || ""}
                    onChange={handleChange}
                    placeholder="Brief overview of the project (2-3 sentences)"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Description</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("description")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Paragraph
                    </Button>
                  </div>

                  {(formData.description as string[]).map((item: string, index: number) => (
                    <div key={`desc-${index}`} className="flex items-center gap-2 mt-2">
                      <Textarea
                        value={item}
                        onChange={(e) => handleArrayChange("description", index, e.target.value)}
                        placeholder="Project description paragraph"
                        className="flex-1"
                        rows={3}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("description", index)}
                        disabled={(formData.description as string[]).length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role || ""}
                      onChange={handleChange}
                      placeholder="Your role in the project"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal</Label>
                    <Input
                      id="goal"
                      name="goal"
                      value={formData.goal || ""}
                      onChange={handleChange}
                      placeholder="Main objective of the project"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Technologies</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("technologies")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Technology
                    </Button>
                  </div>

                  {(formData.technologies as string[]).map((item: string, index: number) => (
                    <div key={`tech-${index}`} className="flex items-center gap-2 mt-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayChange("technologies", index, e.target.value)}
                        placeholder="Technology name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("technologies", index)}
                        disabled={index === 0 && (formData.technologies as string[]).length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Skills</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("skills")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Skill
                    </Button>
                  </div>

                  {(formData.skills as string[]).map((item: string, index: number) => (
                    <div key={`skill-${index}`} className="flex items-center gap-2 mt-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayChange("skills", index, e.target.value)}
                        placeholder="Skill name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("skills", index)}
                        disabled={index === 0 && (formData.skills as string[]).length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Tools</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tools")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Tool
                    </Button>
                  </div>

                  {(formData.tools as string[]).map((item: string, index: number) => (
                    <div key={`tool-${index}`} className="flex items-center gap-2 mt-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayChange("tools", index, e.target.value)}
                        placeholder="Tool name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("tools", index)}
                        disabled={index === 0 && (formData.tools as string[]).length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Tags</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tags")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Tag
                    </Button>
                  </div>

                  {(formData.tags as string[]).map((item: string, index: number) => (
                    <div key={`tag-${index}`} className="flex items-center gap-2 mt-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                        placeholder="Tag name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem("tags", index)}
                        disabled={index === 0 && (formData.tags as string[]).length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">URL to the main image for this project</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demo_url">Demo URL</Label>
                  <Input
                    id="demo_url"
                    name="demo_url"
                    value={formData.demo_url || ""}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-muted-foreground">Link to a live demo of the project</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    name="github_url"
                    value={formData.github_url || ""}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repo"
                  />
                  <p className="text-xs text-muted-foreground">Link to the project's source code repository</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={navigateBack} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Project"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
