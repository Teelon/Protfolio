import Link from "next/link"
import { auth } from "@/auth"
import { MainNav } from "./main-nav"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"

export async function Header() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
