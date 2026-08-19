"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface Query {
  id: string
  name: string
  description: string
  endpoint: string
}

const QUERIES: Query[] = [
  {
    id: "high-value",
    name: "High-Value Customers",
    description: "Find customers with high-value loans AND large lockers",
    endpoint: "/api/queries/high-value-customers",
  },
  {
    id: "no-recurring",
    name: "Branches Without Recurring Deposits",
    description: "Find branches that do not have a Recurring Deposit account type",
    endpoint: "/api/queries/branches-without-account-type",
  },
  {
    id: "stressed",
    name: "Financially Stressed Customers",
    description: "Customers whose total loans exceed their account balances",
    endpoint: "/api/queries/stressed-customers",
  },
  {
    id: "least-active",
    name: "Least Active Branch Employees",
    description: "Employees in the branch with the lowest total account balance",
    endpoint: "/api/queries/least-active-branch-employees",
  },
  {
    id: "digital-gap",
    name: "Digital Adoption Gap",
    description: "Digital service users who haven't made online transactions",
    endpoint: "/api/queries/digital-adoption-gap",
  },
]

export default function QueryExecutor() {
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeQuery = async (query: Query) => {
    try {
      setLoading(true)
      setError(null)
      setSelectedQuery(query)

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const url = `${baseUrl.replace(/\/$/, "")}${query.endpoint}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `Query failed with status ${response.status}`)
      }

      const data = await response.json()
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setResults(data)
      } else {
        setResults([])
        setError("Unexpected response format from server")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query execution failed")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Query Selection */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">Available Queries</h2>
        <div className="grid grid-cols-1 gap-3">
          {QUERIES.map((query) => (
            <button
              key={query.id}
              onClick={() => executeQuery(query)}
              className={`text-left p-4 rounded border transition-all hover:border-primary hover:bg-primary/5 ${
                selectedQuery?.id === query.id ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{query.name}</h3>
                  <p className="text-sm text-foreground/60">{query.description}</p>
                </div>
                <Play size={18} className="text-primary mt-1 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {error && <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">{error}</div>}

      {loading && (
        <div className="bg-card border border-border rounded p-6">
          <div className="text-foreground/60">Executing query...</div>
        </div>
      )}

      {selectedQuery && results.length > 0 && !loading && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{selectedQuery.name} - Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(results[0]).map((key) => (
                    <th key={key} className="text-left py-3 px-4 text-foreground/80 font-semibold">
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-background/50 transition">
                    {Object.values(row).map((val, cidx) => (
                      <td key={cidx} className="py-3 px-4 text-foreground">
                        {typeof val === "number" ? val.toLocaleString("en-IN") : String(val ?? "N/A")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-foreground/60">Total rows: {results.length}</div>
        </div>
      )}

      {selectedQuery && results.length === 0 && !loading && !error && (
        <div className="bg-card border border-border rounded p-6 text-center text-foreground/60">
          No results found for this query.
        </div>
      )}
    </div>
  )
}