"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

type TabNavigationProps = {}

export function TabNavigation({}: TabNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>("profile")

  // Update active tab when search params change
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    } else {
      setActiveTab("profile") // Default tab
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Create new search params
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)

    // Update the URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start border-b pb-0">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
