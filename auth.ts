import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import NeonAdapter from "@auth/neon-adapter"
import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from '@neondatabase/serverless'
import bcrypt from "bcryptjs"

// Configure neon
neonConfig.fetchConnectionCache = true

// Create a Neon pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: NeonAdapter(pool),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const { rows: users } = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
          )

          const user = users[0]

          if (!user || !user.password) {
            return null
          }

          const passwordMatch = await bcrypt.compare(
            password,
            user.password.toString()
          )

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    // Add user role to the token
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // Add user role to the session
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true
} satisfies NextAuthConfig)

// Type definitions
declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: string
  }
}
