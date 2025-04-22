"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function GenerateSlugsButton() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSlugs = async () => {
    try {
      setIsGenerating(true)
      const response = await fetch("/api/projects/generate-slugs", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate slugs")
      }

      const data = await response.json()
      toast({
        title: "Slugs Generated",
        description: data.message,
      })

      router.refresh()
    } catch (error) {
      console.error("Error generating slugs:", error)
      toast({
        title: "Error",
        description: "Failed to generate slugs",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" onClick={generateSlugs} disabled={isGenerating}>
      {isGenerating ? "Generating..." : "Generate Missing Slugs"}
    </Button>
  )
}
