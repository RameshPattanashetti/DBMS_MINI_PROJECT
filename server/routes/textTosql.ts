import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { db } from "../db";

const router = Router();

const DB_SCHEMA_PROMPT = `
You are a MySQL database assistant. Convert user questions to valid SQL queries based on this exact schema:

Tables & Columns (STRICTLY USE THESE EXACT NAMES):
- account (acc_no, type, balance, cust_id, branch_id)
- transaction (acc_no, trans_id, date, amount, type, mode)
- customer (cust_id, name, email, branch_id)
- cust_phone (cust_id, phone_number)
- branch (branch_id, name, location)

JOIN RULES:
- Join "account" and "transaction" using "account.acc_no = transaction.acc_no".
- Join "account" and "customer" using "account.cust_id = customer.cust_id".

STRICT RULES:
- NEVER use "account_id" or "transactions". ALWAYS use "acc_no" and "transaction".
- Respond ONLY with the executable SQL string (no markdown, no backticks).
- Only write SELECT statements.
`;

router.post("/query-ai", async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${DB_SCHEMA_PROMPT}\nUser Question: ${userPrompt}`,
    });

    let generatedSql = response.text?.trim().replace(/```sql|```/g, "").trim();

    // Fallback sanitation for table and column names
    if (generatedSql) {
      generatedSql = generatedSql
        .replace(/\btransactions\b/gi, "transaction")
        .replace(/\baccount_id\b/gi, "acc_no");
    }

    if (!generatedSql?.toUpperCase().startsWith("SELECT")) {
      return res.status(400).json({ error: "Only SELECT queries are allowed." });
    }

    console.log("Executing SQL:", generatedSql);

    const [results] = await db.query(generatedSql);
    
    res.json({ sql: generatedSql, results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;