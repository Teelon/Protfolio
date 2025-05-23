"use server"

import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"
import { z } from "zod"
import { AuthError } from "next-auth"

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

// Create site_settings table if it doesn't exist
async function initializeSiteSettings() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        allow_registration BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Insert default settings if table is empty
    const settings = await sql`SELECT id FROM site_settings LIMIT 1`
    if (settings.length === 0) {
      await sql`
        INSERT INTO site_settings (allow_registration)
        VALUES (true)
      `
    }
  } catch (error) {
    console.error("Error initializing site settings:", error)
  }
}

// Call initialization when the module loads
initializeSiteSettings()

// Function to check if registration is allowed
async function isRegistrationAllowed(): Promise<boolean> {
  try {
    const settings = await sql`
      SELECT allow_registration FROM site_settings
      ORDER BY id DESC LIMIT 1
    `
    return settings.length > 0 ? settings[0].allow_registration : true
  } catch (error) {
    console.error("Error checking registration status:", error)
    return false
  }
}

export async function registerUser(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  // Check if registration is allowed
  const registrationAllowed = await isRegistrationAllowed()
  if (!registrationAllowed) {
    return {
      errors: {
        _form: ["Registration is currently disabled"]
      }
    }
  }

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

    // Hash password with bcryptjs (more secure than bcrypt in browser environments)
    const hashedPassword = await bcrypt.hash(password, 12)

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
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    // If we get here, login was successful
    return {}
  } catch (error) {
    // Handle authentication errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            errors: {
              _form: ["Invalid email or password"],
            },
          }
        default:
          return {
            errors: {
              _form: ["An error occurred during login. Please try again."],
            },
          }
      }
    }

    // Handle other errors
    console.error("Login error:", error)
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

export async function loginAction(formData: FormData) {
  // Validate form data
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // Throw error if validation fails
  if (!validatedFields.success) {
    throw new Error("Invalid email or password")
  }

  const { email, password } = validatedFields.data
  const callbackUrl = (formData.get("callbackUrl") as string) || "/"

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw new Error("Invalid email or password")
        default:
          throw new Error("Something went wrong")
      }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}
