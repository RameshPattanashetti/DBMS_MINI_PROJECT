"use client"

import { useState } from "react"
import CustomerForm from "./forms/customer-form"
import BranchForm from "./forms/branch-form"
import AccountForm from "./forms/account-form"
import TransactionManager from "./transaction-manager"
import AccountDetails from "./account-details"

const TABS = [
  { id: "customers", label: "Customers", Component: CustomerForm },
  { id: "branches", label: "Branches", Component: BranchForm },
  { id: "accounts", label: "Accounts", Component: AccountForm },
  { id: "transactions", label: "Transactions", Component: TransactionManager },
  { id: "account-details", label: "Account Details", Component: AccountDetails },
]

export default function DataManager() {
  const [activeTab, setActiveTab] = useState("customers")

  const activeTabConfig = TABS.find((tab) => tab.id === activeTab) || TABS[0]
  const ActiveComponent = activeTabConfig.Component

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Data Management</h2>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-lg p-6">
        <ActiveComponent />
      </div>
    </div>
  )
}