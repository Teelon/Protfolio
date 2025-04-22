"use client"

import type React from "react"

import { TabProvider } from "@/contexts/tab-context"

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <TabProvider>{children}</TabProvider>
}
