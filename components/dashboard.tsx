"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BranchData {
  Branch_Name: string
  Total_Balance_Value: number
  Total_Accounts: number
  Activity_Level: string
}

interface EfficiencyData {
  Branch_Name: string
  Total_Branch_Salary_Cost: number
  Total_Customers_Served: number
  Cost_Per_Customer: number | string
}

// ⭐ Custom function for consistent Rupee formatting
const formatRupees = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "₹0"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "₹0"

  // Use 'en-IN' locale for Indian numbering system, and 'INR' for currency
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0, // Set to 2 if you need to show paise
  }).format(num)
}


export default function Dashboard() {
  const [branchData, setBranchData] = useState<BranchData[]>([])
  const [efficiencyData, setEfficiencyData] = useState<EfficiencyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)

        const [branchRes, efficiencyRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analysis/branch-profitability`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analysis/employee-efficiency`),
        ])

        if (!branchRes.ok || !efficiencyRes.ok) {
          throw new Error("Failed to fetch analytics")
        }

        const branchResult = await branchRes.json()
        const efficiencyResult = await efficiencyRes.json()

        setBranchData(branchResult)
        setEfficiencyData(efficiencyResult)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("[v0] Dashboard error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-foreground/60">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">Error: {error}</div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branch Profitability Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Branch Profitability</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="Branch_Name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                // ⭐ UPDATED: Use formatRupees function for tooltip values
                formatter={(value) => (typeof value === "number" ? formatRupees(value) : value)}
              />
              <Legend />
              <Bar dataKey="Total_Balance_Value" fill="#3b82f6" name="Total Balance" />
              <Bar dataKey="Total_Accounts" fill="#10b981" name="Total Accounts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Level Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Activity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={branchData}
                dataKey="Total_Accounts"
                nameKey="Branch_Name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {branchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Efficiency */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Employee Cost Efficiency</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground/80">Branch Name</th>
                <th className="text-right py-3 px-4 text-foreground/80">Salary Cost</th>
                <th className="text-right py-3 px-4 text-foreground/80">Customers Served</th>
                <th className="text-right py-3 px-4 text-foreground/80">Cost Per Customer</th>
              </tr>
            </thead>
            <tbody>
              {efficiencyData.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-background/50 transition">
                  <td className="py-3 px-4 text-foreground">{row.Branch_Name}</td>
                  <td className="text-right py-3 px-4 text-foreground">
                    {/* ⭐ UPDATED: Use formatRupees function */}
                    {formatRupees(row.Total_Branch_Salary_Cost)}
                  </td>
                  <td className="text-right py-3 px-4 text-foreground">{row.Total_Customers_Served}</td>
                  <td className="text-right py-3 px-4 text-accent">
                    {/* ⭐ UPDATED: Use formatRupees function */}
                    {formatRupees(row.Cost_Per_Customer)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}