import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { db } from "../db";

const router = Router();

// ==========================================
// FEATURE 2: Text-to-SQL Dynamic Query
// POST /api/insights/query-ai
// ==========================================
router.post("/query-ai", async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
You are a MySQL expert for a Bank Management System database.
Database Schema:
- customer(cust_id, name, email, phone, address)
- account(acc_no, type, balance, status, cust_id, branch_id)
- transaction(trans_id, amount, type, mode, date, acc_no)
- branch(branch_id, branch_name, city)

User Request: "${userPrompt}"

Task: Generate ONLY a valid MySQL SQL query to answer the user request.
Rules:
- Return ONLY raw executable SQL code without markdown code blocks, backticks, or extra explanation.
- Only construct SELECT queries.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let generatedSql = response.text?.trim() || "";
    // Strip code block backticks if present
    generatedSql = generatedSql.replace(/```sql/g, "").replace(/```/g, "").trim();

    // Execute generated query safely against MySQL
    const [results]: any = await db.query(generatedSql);

    res.json({
      prompt: userPrompt,
      sql: generatedSql,
      results,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// FEATURE 3: Customer AI Financial Insights
// GET /api/insights/:cust_id
// ==========================================
router.get("/:cust_id", async (req, res) => {
  try {
    const { cust_id } = req.params;

    // 1. Fetch customer details & account balances from MySQL
    const [accounts]: any = await db.query(
      "SELECT acc_no, type, balance FROM account WHERE cust_id = ?",
      [cust_id]
    );

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ error: "Customer or accounts not found." });
    }

    // 2. Fetch recent transactions across customer accounts
    const [transactions]: any = await db.query(
      `SELECT T.trans_id, T.amount, T.type, T.mode, T.date, T.acc_no 
       FROM transaction T 
       JOIN account A ON T.acc_no = A.acc_no 
       WHERE A.cust_id = ? 
       ORDER BY T.date DESC LIMIT 15`,
      [cust_id]
    );

    // 3. Construct prompt for Gemini
    const prompt = `
You are a financial advisor for a bank. Analyze the following customer data and recent transactions:

Accounts: ${JSON.stringify(accounts)}
Recent Transactions: ${JSON.stringify(transactions)}

Task: Provide EXACTLY 3 concise, highly relevant financial insights or spending habits for this customer.
Rules:
- Format as 3 bullet points.
- Keep each point under 25 words.
- Focus on spending patterns, highest transaction types, or balance management advice.
`;

    // 4. Generate insights using Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const insightsText = response.text?.trim();

    // 5. Send back response
    res.json({
      customerId: cust_id,
      accounts,
      recentTransactionsCount: transactions.length,
      insights: insightsText,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
