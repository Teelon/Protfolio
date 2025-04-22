"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"
import { useTab } from "@/contexts/tab-context"

interface ExperienceFormProps {
  experience?: {
    id: number
    position: string
    company: string
    location: string
    employment_type: string
    start_date: string
    end_date: string | null
    current: boolean
    description: string[]
  }
  mode: "create" | "edit"
}

const defaultExperience = {
  id: 0,
  position: "",
  company: "",
  location: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  current: false,
  description: [""],
}

export function ExperienceForm({ experience = defaultExperience, mode }: ExperienceFormProps) {
  const router = useRouter()
  const { setActiveTab } = useTab()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(experience)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      current: checked,
      end_date: checked ? null : prev.end_date,
    }))
  }

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescription = [...formData.description]
    newDescription[index] = value
    setFormData((prev) => ({ ...prev, description: newDescription }))
  }

  const addDescriptionItem = () => {
    setFormData((prev) => ({
      ...prev,
      description: [...prev.description, ""],
    }))
  }

  const removeDescriptionItem = (index: number) => {
    const newDescription = [...formData.description]
    newDescription.splice(index, 1)
    setFormData((prev) => ({ ...prev, description: newDescription }))
  }

  // Update the handleSubmit function to use query parameters
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = mode === "create" ? "/api/resume/experience" : `/api/resume/experience/${experience.id}`

      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          description: formData.description.filter((item) => item.trim() !== ""),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${mode} experience`)
      }

      toast({
        title: `Experience ${mode === "create" ? "Created" : "Updated"}`,
        description: `Your experience has been ${mode === "create" ? "created" : "updated"} successfully.`,
      })

      // Use query parameter to ensure the experience tab is active
      router.push("/admin/resume?tab=experience")
      router.refresh()
    } catch (error) {
      console.error(`Error ${mode}ing experience:`, error)
      toast({
        title: "Error",
        description: `Failed to ${mode} experience. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleDelete function to use query parameters
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this experience?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/resume/experience/${experience.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete experience")
      }

      toast({
        title: "Experience Deleted",
        description: "Your experience has been deleted successfully.",
      })

      // Use query parameter to ensure the experience tab is active
      router.push("/admin/resume?tab=experience")
      router.refresh()
    } catch (error) {
      console.error("Error deleting experience:", error)
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update the navigateBack function to use query parameters
  const navigateBack = () => {
    router.push("/admin/resume?tab=experience")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{mode === "create" ? "Add Experience" : "Edit Experience"}</CardTitle>
        {mode === "edit" && (
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
            Delete
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type</Label>
              <Input
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                placeholder="Full-Time, Part-Time, Contract, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
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
                disabled={formData.current}
              />
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="current" checked={formData.current} onCheckedChange={handleCheckboxChange} />
                <label
                  htmlFor="current"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Current Position
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            {formData.description.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Textarea
                  value={item}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  placeholder="Bullet point description"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDescriptionItem(index)}
                  disabled={formData.description.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addDescriptionItem} className="mt-2">
              Add Description Item
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={navigateBack} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
