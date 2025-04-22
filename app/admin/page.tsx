import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const session = await auth()

  // This should be handled by middleware, but adding an extra check
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to the admin dashboard. This page is only accessible to users with the admin role.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a protected admin section that only users with the admin role can access.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage your portfolio content</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a protected admin section that only users with the admin role can access.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
