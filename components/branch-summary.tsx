"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BranchSummaryData {
  Branch_Name: string
  Branch_Location: string
  Total_Accounts: number
  Total_Balance_Value: number
}

export default function BranchSummary() {
  const [branches, setBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [summary, setSummary] = useState<BranchSummaryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/queries/branches`)
        if (!response.ok) throw new Error("Failed to fetch branches")
        const data = await response.json()
        setBranches(data || [])
      } catch (err) {
        console.error("[v0] Error fetching branches:", err)
        setError("Failed to load branches")
      }
    }
    fetchBranches()
  }, [])

  // Fetch branch summary when branch is selected
  useEffect(() => {
    if (!selectedBranch) {
      setSummary(null)
      return
    }

    const fetchSummary = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analysis/branch-summary/${selectedBranch}`)

        if (!response.ok) throw new Error("Failed to fetch summary")

        const data = await response.json()
        setSummary(data)
      } catch (err) {
        console.error("[v0] Error fetching summary:", err)
        setError("Failed to load branch summary")
        setSummary(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [selectedBranch])

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Branch Account Summary</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">Select Branch</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a branch..." />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                    {branch.name} - {branch.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="text-foreground/60">Loading branch summary...</div>
        </div>
      )}

      {error && <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">{error}</div>}

      {summary && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch Info */}
          <Card className="bg-card border border-border p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground/60 mb-1">Branch Name</h3>
                <p className="text-xl font-bold text-foreground">{summary.Branch_Name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground/60 mb-1">Location</h3>
                <p className="text-lg text-foreground">{summary.Branch_Location}</p>
              </div>
            </div>
          </Card>

          {/* Account Statistics */}
          <Card className="bg-card border border-border p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground/60 mb-1">Total Accounts</h3>
                <p className="text-3xl font-bold text-accent">{summary.Total_Accounts}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground/60 mb-1">Total Balance Value</h3>
                <p className="text-2xl font-bold text-primary">
                  $
                  {Number(summary.Total_Balance_Value || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!selectedBranch && !loading && (
        <div className="bg-background border border-border/50 rounded-lg p-8 text-center">
          <p className="text-foreground/60">Select a branch to view account summary details</p>
        </div>
      )}
    </div>
  )
}
