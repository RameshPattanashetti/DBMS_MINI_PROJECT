"use client"

import { Database, BarChart3, Settings, Building2 } from "lucide-react"

interface NavigationProps {
  currentSection: string
  onNavigate: (section: string) => void
}

export default function Navigation({ currentSection, onNavigate }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "queries", label: "Queries", icon: Database },
    { id: "branch-summary", label: "Branch Summary", icon: Building2 },
    { id: "data", label: "Data Management", icon: Settings },
  ]

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Bank Management System</h1>
          <div className="text-sm text-foreground/60">DBMS Mini Project</div>
        </div>

        <div className="flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isActive ? "bg-primary text-white" : "bg-background text-foreground hover:bg-background/80"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
