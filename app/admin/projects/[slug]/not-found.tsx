import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AdminProjectNotFound() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The project you're trying to edit doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects Management
          </Link>
        </Button>
      </div>
    </div>
  )
}
