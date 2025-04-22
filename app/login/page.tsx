import { LoginForm } from "@/components/auth/login-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  // Check if user is already logged in
  const session = await auth()
  if (session?.user) {
    redirect("/")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <LoginForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  )
}
