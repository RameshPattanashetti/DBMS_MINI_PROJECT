"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function AccountForm() {
  const [formData, setFormData] = useState({
    acc_no: "",
    type: "Savings",
    balance: "",
    cust_id: "",
    branch_id: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const [showRecords, setShowRecords] = useState(false)
  const [records, setRecords] = useState<any[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(`${API_BASE}/api/data/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acc_no: Number(formData.acc_no),
          type: formData.type,
          balance: Number.parseFloat(formData.balance) || 0,
          cust_id: Number(formData.cust_id),
          branch_id: Number(formData.branch_id),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add account")
      }

      setMessageType("success")
      setMessage("Account added successfully!")
      setFormData({ acc_no: "", type: "Savings", balance: "", cust_id: "", branch_id: "" })
      if (showRecords) fetchRecords()
    } catch (err: any) {
      setMessageType("error")
      setMessage(err.message || "Error adding account")
    } finally {
      setLoading(false)
    }
  }

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/data/accounts`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setRecords(data)
        setShowRecords(true)
      }
    } catch (err) {
      console.error("Error fetching account records:", err)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Account Number *</label>
          <input
            type="number"
            name="acc_no"
            placeholder="e.g. 1001"
            value={formData.acc_no}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-background"
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Fixed Deposit">Fixed Deposit</option>
            <option value="Recurring Deposit">Recurring Deposit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Initial Balance *</label>
          <input
            type="number"
            step="0.01"
            name="balance"
            placeholder="0.00"
            value={formData.balance}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded bg-background"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer ID *</label>
            <input
              type="number"
              name="cust_id"
              placeholder="e.g. 1"
              value={formData.cust_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Branch ID *</label>
            <input
              type="number"
              name="branch_id"
              placeholder="e.g. 1"
              value={formData.branch_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded bg-background"
            />
          </div>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded text-sm ${
              messageType === "success"
                ? "bg-green-500/10 text-green-600 border border-green-500"
                : "bg-red-500/10 text-red-600 border border-red-500"
            }`}
          >
            {messageType === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded font-medium disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Account"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (showRecords) setShowRecords(false)
              else fetchRecords()
            }}
            className="px-4 py-2 border rounded flex items-center gap-2"
          >
            {showRecords ? <EyeOff size={16} /> : <Eye size={16} />}
            {showRecords ? "Hide" : "View"} Records
          </button>
        </div>
      </form>

      {showRecords && records.length > 0 && (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-bold mb-3">Account Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {Object.keys(records[0]).map((key) => (
                    <th key={key} className="text-left py-2 px-3 font-semibold">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    {Object.values(row).map((val: any, cidx) => (
                      <td key={cidx} className="py-2 px-3">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}