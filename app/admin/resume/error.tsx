"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Resume admin page error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-10">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          There was an error loading the resume management page. Please try again or contact support if the problem
          persists.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
