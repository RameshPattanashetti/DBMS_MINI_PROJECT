"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Dashboard from "@/components/dashboard"
import QueryExecutor from "@/components/query-executor"
import DataManager from "@/components/data-manager"
import BranchSummary from "@/components/branch-summary"
import ChatDrawer from "@/components/chatDrawer"
import TextToSqlSearch from "@/components/TextToSqlSearch"
import CustomerInsights from "@/components/CustomerInsights"

export default function Home() {
  const [currentSection, setCurrentSection] = useState("dashboard")

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard />
      case "queries":
        return <QueryExecutor />
      case "data":
        return <DataManager />
      case "branch-summary":
        return <BranchSummary />
      case "ai-insights":
        return (
          <div className="space-y-8">
            <TextToSqlSearch />
            <CustomerInsights />
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation currentSection={currentSection} onNavigate={setCurrentSection} />
      <main className="max-w-7xl mx-auto px-4 py-8">{renderSection()}</main>
      <ChatDrawer />
    </div>
  )
}