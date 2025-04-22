"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CertificationFormProps {
  certification?: {
    id: number
    title: string
    issuer: string
    issue_date: string
    expiry_date: string | null
    description: string | null
  }
  mode: "create" | "edit"
}

const defaultCertification = {
  id: 0,
  title: "",
  issuer: "",
  issue_date: new Date().toISOString().split("T")[0], // Set default to today's date
  expiry_date: "",
  description: "",
}

export function CertificationForm({ certification = defaultCertification, mode }: CertificationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(certification)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.issuer.trim()) {
      newErrors.issuer = "Issuer is required"
    }

    if (!formData.issue_date) {
      newErrors.issue_date = "Issue date is required"
    }

    // Date validation
    if (formData.issue_date && formData.expiry_date && new Date(formData.issue_date) > new Date(formData.expiry_date)) {
      newErrors.expiry_date = "Expiry date cannot be before issue date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submission initiated with data:", formData)

    // Validate form before submission
    if (!validateForm()) {
      console.log("Form validation failed with errors:", errors)
      return
    }

    setIsLoading(true)
    setFormError(null)

    try {
      const url = mode === "create" ? "/api/resume/certifications" : `/api/resume/certifications/${certification.id}`
      const method = mode === "create" ? "POST" : "PUT"

      // Prepare the data - ensure dates are in the correct format
      const dataToSubmit = {
        ...formData,
        // Convert empty strings to null for optional fields
        expiry_date: formData.expiry_date || null,
        description: formData.description || null,
      }

      console.log(`Submitting ${method} request to ${url} with data:`, dataToSubmit)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      })

      console.log("Response status:", response.status)

      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (!response.ok) {
        // Extract error message from response
        const errorMessage = responseData.error || `Failed to ${mode} certification`
        throw new Error(errorMessage)
      }

      toast({
        title: `Certification ${mode === "create" ? "Created" : "Updated"}`,
        description: `Your certification has been ${mode === "create" ? "created" : "updated"} successfully.`,
      })

      // Use query parameter to ensure the certifications tab is active
      router.push("/admin/resume?tab=certifications")
      router.refresh()
    } catch (error) {
      console.error(`Error ${mode}ing certification:`, error)

      // Set form error message
      setFormError(error instanceof Error ? error.message : `Failed to ${mode} certification. Please try again.`)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} certification. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return
    }

    setIsLoading(true)
    setFormError(null)

    try {
      const response = await fetch(`/api/resume/certifications/${certification.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        // Try to get detailed error message from response
        let errorMessage = "Failed to delete certification"
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (e) {
          // If parsing fails, use status text
          errorMessage = `${response.status}: ${response.statusText || errorMessage}`
        }

        throw new Error(errorMessage)
      }

      toast({
        title: "Certification Deleted",
        description: "Your certification has been deleted successfully.",
      })

      // Use query parameter to ensure the certifications tab is active
      router.push("/admin/resume?tab=certifications")
      router.refresh()
    } catch (error) {
      console.error("Error deleting certification:", error)

      // Set form error message
      setFormError(error instanceof Error ? error.message : "Failed to delete certification. Please try again.")

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete certification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to safely navigate back to the resume page with the certifications tab
  const navigateBack = () => {
    router.push("/admin/resume?tab=certifications")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>{mode === "create" ? "Add Certification" : "Edit Certification"}</CardTitle>
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
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                  className={errors.issuer ? "border-destructive" : ""}
                />
                {errors.issuer && <p className="text-sm text-destructive">{errors.issuer}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  required
                  className={errors.issue_date ? "border-destructive" : ""}
                />
                {errors.issue_date && <p className="text-sm text-destructive">{errors.issue_date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date || ""}
                  onChange={handleChange}
                  className={errors.expiry_date ? "border-destructive" : ""}
                />
                {errors.expiry_date && <p className="text-sm text-destructive">{errors.expiry_date}</p>}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add any additional details about the certification"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={navigateBack} disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Add Certification" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
