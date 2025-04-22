"use server"

import { sql } from "@/lib/db"
import bcrypt from "bcrypt"
import { z } from "zod"

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

export async function resetPassword(
  userId: string,
  prevState: PasswordResetFormState,
  formData: FormData,
): Promise<PasswordResetFormState> {
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
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${userId}
    `

    return {
      success: true,
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return {
      errors: {
        _form: ["An error occurred while resetting your password. Please try again."],
      },
    }
  }
}
