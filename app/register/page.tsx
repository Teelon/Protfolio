import { RegisterForm } from "@/components/auth/register-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AuthProvider } from "@/providers/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"

export default async function RegisterPage() {
  // Check if user is already logged in
  const session = await auth()
  if (session?.user) {
    redirect("/")
  }

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="container flex min-h-[100dvh] w-full items-center justify-center px-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[350px] -mt-16">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
              <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}
