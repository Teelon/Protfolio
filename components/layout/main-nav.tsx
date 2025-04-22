"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  const isAdmin = !isLoading && user?.role === "admin"

  // Define routes
  const routes = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ]

  // Define admin routes
  const adminRoutes = [
    {
      name: "Dashboard",
      path: "/admin",
      description: "Admin dashboard overview",
    },
    {
      name: "Users",
      path: "/admin/users",
      description: "Manage user accounts",
    },
    {
      name: "Projects",
      path: "/admin/manage-projects",
      description: "Manage portfolio projects",
    },
    {
      name: "Resume",
      path: "/admin/resume",
      description: "Manage resume information",
    },
  ]

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo - Left aligned */}
        <div className="flex-none">
          <Link href="/" className="flex items-center space-x-2 transition-colors hover:text-foreground/80">
            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">DataPortfolio</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="flex-1 flex justify-center relative">
          <NavigationMenu className="relative">
            <NavigationMenuList className="gap-1">
              {routes.map((route) => (
                <NavigationMenuItem key={route.path}>
                  <Link href={route.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        pathname === route.path && "bg-accent/50 text-accent-foreground font-medium"
                      )}
                    >
                      {route.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}

              {/* Admin Dropdown Menu - Only show if user is admin */}
              {isAdmin && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      pathname.startsWith("/admin") && "bg-accent/50 text-accent-foreground font-medium"
                    )}
                  >
                    Admin
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[220px] p-1 bg-popover rounded-md border shadow-md">
                      {adminRoutes.map((route) => (
                        <li key={route.path}>
                          <Link
                            href={route.path}
                            className={cn(
                              "block select-none space-y-1 rounded-sm px-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              (pathname === route.path || pathname.startsWith(route.path + "/")) &&
                                "bg-accent/50 text-accent-foreground font-medium"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="text-sm font-medium leading-none">{route.name}</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                              {route.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-none md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[300px] pr-0">
              <nav className="flex flex-col gap-4 mt-6">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "px-4 py-2 text-base transition-colors hover:bg-accent hover:text-accent-foreground rounded-md",
                      pathname === route.path ? "bg-accent/50 text-accent-foreground font-medium" : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.name}
                  </Link>
                ))}

                {/* Mobile Admin Section */}
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="px-4 mb-2 text-sm font-semibold text-foreground">Admin</div>
                    <div className="space-y-1">
                      {adminRoutes.map((route) => (
                        <Link
                          key={route.path}
                          href={route.path}
                          className={cn(
                            "block px-4 py-2 text-base transition-colors hover:bg-accent hover:text-accent-foreground rounded-md",
                            (pathname === route.path || pathname.startsWith(route.path + "/"))
                              ? "bg-accent/50 text-accent-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="text-sm font-medium">{route.name}</div>
                          <p className="text-xs text-muted-foreground mt-0.5">{route.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
