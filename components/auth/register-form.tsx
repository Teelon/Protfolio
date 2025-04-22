"use client"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { registerUser, type RegisterFormState } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const initialState: RegisterFormState = {}

function RegisterButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account..." : "Create Account"}
    </Button>
  )
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, initialState)
  const router = useRouter()
  const [registrationDisabled, setRegistrationDisabled] = useState(false)

  useEffect(() => {
    // If registration is disabled from the server action response
    if (state.errors?._form?.includes("Registration is currently disabled")) {
      setRegistrationDisabled(true)
    }
  }, [state.errors?._form])

  // Redirect to login page after successful registration
  if (state.success) {
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  return (
    <div className="grid gap-6 w-full">
      <form action={formAction} className="w-full">
        <div className="grid gap-4">
          {state.errors?._form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.errors._form.join(", ")}</AlertDescription>
            </Alert>
          )}

          {state.success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Registration successful! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              disabled={state.success || registrationDisabled}
              aria-invalid={!!state.errors?.name}
              className="w-full"
            />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(", ")}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={state.success || registrationDisabled}
              aria-invalid={!!state.errors?.email}
              className="w-full"
            />
            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email.join(", ")}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={state.success || registrationDisabled}
              aria-invalid={!!state.errors?.password}
              className="w-full"
            />
            {state.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password.join(", ")}</p>
            )}
          </div>

          <RegisterButton />
        </div>
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
