"use server"

import { sql } from "@/lib/db"
import bcrypt from "bcrypt"
import { signIn } from "@/auth"
import { z } from "zod"

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type RegisterFormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    _form?: string[]
  }
  success?: boolean
}

export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
}

export async function registerUser(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  // Validate form data
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return {
        errors: {
          _form: ["User with this email already exists"],
        },
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, 'user')
    `

    return {
      success: true,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      errors: {
        _form: ["An error occurred during registration. Please try again."],
      },
    }
  }
}

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // Validate form data
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    // Attempt to sign in
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    // Handle authentication errors
    if (result?.error) {
      return {
        errors: {
          _form: ["Invalid email or password"],
        },
      }
    }

    // If we get here, login was successful
    return {}
  } catch (error) {
    console.error("Login error:", error)
    return {
      errors: {
        _form: ["An error occurred during login. Please try again."],
      },
    }
  }
}

export async function loginAndRedirect(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) || "/"

  await signIn("credentials", {
    email,
    password,
    redirectTo: callbackUrl,
  })
}
