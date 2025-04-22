"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RequireRoleProps {
  role: string
  children: React.ReactNode
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== role)) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
    }
  }, [user, isLoading, role, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== role) {
    return null
  }

  return <>{children}</>
}