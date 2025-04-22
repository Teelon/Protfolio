"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
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

        const data = await res.json()

        if (data.user) {
          setState({
            user: data.user,
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
