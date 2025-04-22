"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useTab } from "@/contexts/tab-context"

interface EducationFormProps {
  education?: {
    id: number
    degree: string
    institution: string
    location: string
    start_date: string
    end_date: string | null
    gpa: string | null
  }
  mode: "create" | "edit"
}

const defaultEducation = {
  id: 0,
  degree: "",
  institution: "",
  location: "",
  start_date: "",
  end_date: "",
  gpa: "",
}

export function EducationForm({ education = defaultEducation, mode }: EducationFormProps) {
  const router = useRouter()
  const { setActiveTab } = useTab()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(education)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = mode === "create" ? "/api/resume/education" : `/api/resume/education/${education.id}`

      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${mode} education`)
      }

      toast({
        title: `Education ${mode === "create" ? "Created" : "Updated"}`,
        description: `Your education has been ${mode === "create" ? "created" : "updated"} successfully.`,
      })

      // Use query parameter to ensure the education tab is active
      router.push("/admin/resume?tab=education")
      router.refresh()
    } catch (error) {
      console.error(`Error ${mode}ing education:`, error)
      toast({
        title: "Error",
        description: `Failed to ${mode} education. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this education?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/resume/education/${education.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete education")
      }

      toast({
        title: "Education Deleted",
        description: "Your education has been deleted successfully.",
      })

      // Use query parameter to ensure the education tab is active
      router.push("/admin/resume?tab=education")
      router.refresh()
    } catch (error) {
      console.error("Error deleting education:", error)
      toast({
        title: "Error",
        description: "Failed to delete education. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update the navigateBack function to use query parameters
  const navigateBack = () => {
    router.push("/admin/resume?tab=education")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>{mode === "create" ? "Add Education" : "Edit Education"}</CardTitle>
          {mode === "edit" && (
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
              Delete
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  name="gpa"
                  value={formData.gpa || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
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
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={navigateBack} disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Add Education" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
