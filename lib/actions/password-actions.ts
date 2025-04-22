"use server"

import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { auth } from "@/auth"

const passwordResetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type PasswordResetFormState = {
  errors?: {
    password?: string[]
    confirmPassword?: string[]
    _form?: string[]
  }
  success?: boolean
}

export async function changePassword(
  prevState: PasswordResetFormState,
  formData: FormData,
): Promise<PasswordResetFormState> {
  // Get current user
  const session = await auth()
  if (!session?.user?.id) {
    return {
      errors: {
        _form: ["You must be logged in to change your password"],
      },
    }
  }

  // Validate form data
  const validatedFields = passwordResetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { password } = validatedFields.data

  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${session.user.id}
    `

    return {
      success: true,
    }
  } catch (error) {
    console.error("Password change error:", error)
    return {
      errors: {
        _form: ["An error occurred while changing your password. Please try again."],
      },
    }
  }
}
