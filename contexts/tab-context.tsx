"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

type TabType = "profile" | "experience" | "education" | "certifications"

interface TabContextType {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

const TabContext = createContext<TabContextType | undefined>(undefined)

export function TabProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const tabParam = searchParams.get("tab") || "profile"

  // Validate tab value
  const validTabs = ["profile", "experience", "education", "certifications"]
  const initialTab = validTabs.includes(tabParam) ? tabParam : "profile"

  const [activeTab, setActiveTab] = useState<TabType>(initialTab as TabType)

  // Update URL when tab changes
  const updateTab = (tab: TabType) => {
    setActiveTab(tab)

    // Create new search params
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)

    // Update the URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Update active tab when search params change
  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam as TabType)
    }
  }, [tabParam])

  return <TabContext.Provider value={{ activeTab, setActiveTab: updateTab }}>{children}</TabContext.Provider>
}

export function useTab() {
  const context = useContext(TabContext)
  if (context === undefined) {
    throw new Error("useTab must be used within a TabProvider")
  }
  return context
}
