import { Router, type Request, type Response } from "express";
import { getPool } from "../db";

const router = Router();

// GET /api/transactions/balance/:acc_no
router.get("/balance/:acc_no", async (req: Request, res: Response) => {
  try {
    const { acc_no } = req.params;
    const pool = getPool();

    const [rows]: any = await pool.execute(
      "SELECT acc_no, balance, type FROM Account WHERE acc_no = ?",
      [Number(acc_no)]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error("[GET /balance Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/transactions/deposit
router.post("/deposit", async (req: Request, res: Response) => {
  try {
    const { acc_no, amount, mode } = req.body;
    const depositAmt = Number(amount);
    const pool = getPool();

    if (!depositAmt || depositAmt <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    const [result]: any = await pool.execute(
      "UPDATE Account SET balance = balance + ? WHERE acc_no = ?",
      [depositAmt, Number(acc_no)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const trans_id = Math.floor(Math.random() * 1000000);
    await pool.execute(
      "INSERT INTO Transaction (acc_no, trans_id, amount, type, mode) VALUES (?, ?, ?, 'Deposit', ?)",
      [Number(acc_no), trans_id, depositAmt, mode || "Branch"]
    );

    res.json({ message: "Deposit successful" });
  } catch (error: any) {
    console.error("[POST /deposit Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/transactions/withdraw
router.post("/withdraw", async (req: Request, res: Response) => {
  try {
    const { acc_no, amount, mode } = req.body;
    const withdrawAmt = Number(amount);
    const pool = getPool();

    if (!withdrawAmt || withdrawAmt <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    const [rows]: any = await pool.execute(
      "SELECT balance FROM Account WHERE acc_no = ?",
      [Number(acc_no)]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (Number(rows[0].balance) < withdrawAmt) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await pool.execute(
      "UPDATE Account SET balance = balance - ? WHERE acc_no = ?",
      [withdrawAmt, Number(acc_no)]
    );

    const trans_id = Math.floor(Math.random() * 1000000);
    await pool.execute(
      "INSERT INTO Transaction (acc_no, trans_id, amount, type, mode) VALUES (?, ?, ?, 'Withdrawal', ?)",
      [Number(acc_no), trans_id, withdrawAmt, mode || "Branch"]
    );

    res.json({ message: "Withdrawal successful" });
  } catch (error: any) {
    console.error("[POST /withdraw Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;