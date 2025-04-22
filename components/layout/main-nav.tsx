"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function MainNav({ mobile = false }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  
  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const adminNavItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Manage Projects", href: "/admin/manage-projects" },
    { name: "Manage Resume", href: "/admin/resume" },
    { name: "Manage Users", href: "/admin/users" },
  ]
  
  // Mobile navigation - flat list of all accessible routes
  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2">
        {publicNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-base px-2 py-1 rounded-md transition-colors ${
              pathname === item.href
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {item.name}
          </Link>
        ))}
        {isAdmin && adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-base px-2 py-1 rounded-md transition-colors ${
              pathname === item.href
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    )
  }
  
  // Desktop navigation
  return (
    <nav className="inline-flex items-center">
      {publicNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
      
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Admin <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {adminNavItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={pathname === item.href ? "font-medium" : ""}
                >
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  )
}