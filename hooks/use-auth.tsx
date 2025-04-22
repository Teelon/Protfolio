"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })
  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) {
          throw new Error("Failed to fetch session")
        }

        const session = await res.json()

        if (session?.user) {
          setState({
            user: session.user,
            isLoading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          })
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error("An unknown error occurred"),
        })
      }
    }

    fetchSession()
  }, [router])

  return state
}
