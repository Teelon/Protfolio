import type React from "react"
import { AuthProvider } from "@/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css"
import { auth } from "@/auth"
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Data Analytics Portfolio",
  description: "A modern data analytics portfolio website",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <Header user={user} />
              <main className="flex-1">{children}  <Analytics /></main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} Data Analytics Portfolio. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
