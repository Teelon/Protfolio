"use client"
import Link from "next/link"
import { MainNav } from "./main-nav"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface HeaderProps {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  } | null
}

export function Header({ user: serverUser }: HeaderProps) {
  const { user: clientUser } = useAuth()
  // Use client-side user data if available, otherwise fall back to server data
  const user = clientUser || serverUser

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop: Logo on left */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="font-bold text-xl">
              YourLogo
            </Link>
          </div>

          {/* Desktop: Main Nav centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <MainNav />
          </div>

          {/* Desktop: Auth Buttons on right */}
          <div className="hidden md:flex md:items-center md:gap-4">
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
          
          {/* Mobile: Logo and Hamburger */}
          <div className="flex items-center justify-between md:hidden w-full">
            <Link href="/" className="font-bold text-xl">
              YourLogo
            </Link>
            <MobileMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ user }: { user: HeaderProps["user"] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-background border-b p-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            {/* Mobile Navigation */}
            <div className="py-2">
              <MainNav mobile={true} />
            </div>
            
            {/* Mobile Auth */}
            <div className="py-2 border-t">
              {user ? (
                <div className="py-2">
                  <UserMenu user={user} mobile={true} />
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" className="justify-start" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}