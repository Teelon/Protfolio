"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings } from "lucide-react"

interface UserMenuProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  } | null
  mobile?: boolean
}

export function UserMenu({ user, mobile = false }: UserMenuProps) {
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }
  
  // For mobile view, display a simpler menu without dropdown
  if (mobile) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} alt={user?.name || undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{user?.name}</div>
        </div>
        
        <Link 
          href="/profile" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          <User size={16} />
          <span>Profile</span>
        </Link>
        
        <Link 
          href="/settings" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          <Settings size={16} />
          <span>Settings</span>
        </Link>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1"
          onClick={handleSignOut}
        >
          <LogOut size={16} className="mr-2" />
          <span>Sign out</span>
        </Button>
      </div>
    )
  }
  
  // Desktop dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} alt={user?.name || undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault()
            handleSignOut()
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}