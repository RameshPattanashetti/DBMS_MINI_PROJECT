"use client";

import { useState } from "react";

export default function CustomerInsights() {
  const [custId, setCustId] = useState("101");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    if (!custId.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`http://localhost:5000/api/insights/${custId}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to fetch insights");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-card text-card-foreground border rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-bold">Feature 3: AI Customer Insights</h2>
      <p className="text-sm text-muted-foreground">
        Analyze account balances and spending habits for a specific customer using AI.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={custId}
          onChange={(e) => setCustId(e.target.value)}
          placeholder="Enter Customer ID"
          className="w-40 px-3 py-2 border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white font-medium text-sm rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Generating..." : "Get AI Insights"}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {data && (
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/30">
            <h3 className="font-semibold text-base mb-2">
              Account Summary (Customer #{data.customerId})
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {data.accounts.map((acc: any) => (
                <li key={acc.acc_no}>
                  Account #{acc.acc_no} ({acc.type}): <span className="font-bold">${acc.balance}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border-l-4 border-sky-500 rounded-r-md whitespace-pre-line text-sm text-sky-950 dark:text-sky-100">
            <h4 className="font-bold mb-2">Gemini Spending Insights:</h4>
            {data.insights}
          </div>
        </div>
      )}
    </div>
  );
}