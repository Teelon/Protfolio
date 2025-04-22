import { handlers } from "@/auth"

// Disable edge runtime for auth endpoints
export const runtime = 'nodejs'

export const { GET, POST } = handlers
