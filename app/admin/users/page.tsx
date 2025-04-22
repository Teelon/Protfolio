import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function UsersPage() {
  const session = await auth()

  // This should be handled by middleware, but adding an extra check
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin/users")
  }

  // Fetch all users
  const users = await sql`
    SELECT id, name, email, role, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <p className="text-muted-foreground mb-6">View and manage user accounts in your system.</p>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.updated_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
