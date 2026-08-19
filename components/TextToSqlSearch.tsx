"use client";

import { useState } from "react";

export default function TextToSqlSearch() {
  const [prompt, setPrompt] = useState("");
  const [sql, setSql] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setSql("");
    setResults([]);

    try {
      const res = await fetch("http://localhost:5000/api/insights/query-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to execute query");
      }

      setSql(data.sql);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-card text-card-foreground border rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-bold">Feature 2: Text-to-SQL Search</h2>
      <p className="text-sm text-muted-foreground">
        Ask any question in plain English to generate and execute database queries dynamically.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Show total deposits for customer 101"
          className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Analyzing..." : "Ask AI"}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {sql && (
        <div className="p-3 bg-zinc-950 text-emerald-400 font-mono text-xs rounded-md overflow-x-auto">
          <strong className="text-zinc-400">Generated SQL:</strong> {sql}
        </div>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted text-muted-foreground font-medium">
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key} className="p-3 border-b border-r last:border-r-0">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} className="border-b last:border-b-0 hover:bg-muted/50">
                  {Object.values(row).map((val: any, i) => (
                    <td key={i} className="p-3 border-r last:border-r-0">
                      {val !== null ? String(val) : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}