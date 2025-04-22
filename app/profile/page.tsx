import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile")
  }

  const { user } = session

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="grid gap-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Name</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Role</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </CardContent>
        </Card>

        {user.role === "admin" && (
          <Button asChild>
            <Link href="/admin">Go to Admin Dashboard</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
