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
import TextToSqlSearch from "@/components/TextToSqlSearch"
import CustomerInsights from "@/components/CustomerInsights"

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

const formatRupees = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "₹0"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "₹0"

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
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
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

        const [branchRes, efficiencyRes] = await Promise.all([
          fetch(`${baseUrl}/api/analysis/branch-profitability`),
          fetch(`${baseUrl}/api/analysis/employee-efficiency`),
        ])

        if (!branchRes.ok || !efficiencyRes.ok) {
          throw new Error("Failed to fetch analytics from backend")
        }

        const branchResult = await branchRes.json()
        const efficiencyResult = await efficiencyRes.json()

        setBranchData(branchResult || [])
        setEfficiencyData(efficiencyResult || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("[Dashboard Error]:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="space-y-8">
      {/* AI Features */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">AI Power Tools</h1>
        <TextToSqlSearch />
        <CustomerInsights />
      </div>

      <hr className="border-border my-8" />

      {/* Analytics Charts */}
      <h1 className="text-2xl font-bold text-foreground">Branch Analytics</h1>

      {loading && (
        <div className="flex items-center justify-center h-48 border border-border rounded-lg bg-card">
          <div className="text-foreground/60">Loading live analytics...</div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">
          <strong>Analytics Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profitability Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Branch Profitability</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="Branch_Name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                    formatter={(value: any, name: any) => {
                      if (name === "Total Balance (₹)" || name === "Total_Balance_Value") {
                        return [formatRupees(value), "Total Balance (₹)"]
                      }
                      return [value, "Total Accounts"]
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Total_Balance_Value" fill="#3b82f6" name="Total Balance (₹)" />
                  <Bar dataKey="Total_Accounts" fill="#10b981" name="Total Accounts" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Account Distribution</h2>
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
                    {branchData.map((_, index) => (
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

          {/* Efficiency Table */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Employee Cost Efficiency</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-foreground/80">
                    <th className="py-3 px-4">Branch Name</th>
                    <th className="text-right py-3 px-4">Salary Cost</th>
                    <th className="text-right py-3 px-4">Customers Served</th>
                    <th className="text-right py-3 px-4">Cost Per Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {efficiencyData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-background/50 transition">
                      <td className="py-3 px-4 text-foreground">{row.Branch_Name}</td>
                      <td className="text-right py-3 px-4 text-foreground">
                        {formatRupees(row.Total_Branch_Salary_Cost)}
                      </td>
                      <td className="text-right py-3 px-4 text-foreground">{row.Total_Customers_Served}</td>
                      <td className="text-right py-3 px-4 text-accent">
                        {formatRupees(row.Cost_Per_Customer)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}