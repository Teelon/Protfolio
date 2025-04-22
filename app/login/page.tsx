import { LoginForm } from "@/components/auth/login-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Check if user is already logged in
  const session = await auth()
  if (session?.user) {
    redirect("/")
  }

  // Handle the callbackUrl from searchParams
  const callbackUrl = searchParams.callbackUrl ?? "/"
  const sanitizedCallbackUrl = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl

  return (
    <div className="container flex min-h-[100dvh] w-full items-center justify-center px-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[350px] -mt-16">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <LoginForm callbackUrl={sanitizedCallbackUrl} />
      </div>
    </div>
  )
}
