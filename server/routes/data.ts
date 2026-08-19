import { Router, type Request, type Response } from "express";
import { getPool } from "../db";

const router = Router();

// GET Customers
router.get("/customers", async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [results]: any = await pool.execute("SELECT * FROM Customer");
    res.json(results);
  } catch (error: any) {
    console.error("[GET /customers Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST Customer
router.post("/customers", async (req: Request, res: Response) => {
  try {
    const { cust_id, name, street, city, pincode, DOB } = req.body;
    const pool = getPool();

    await pool.execute(
      "INSERT INTO Customer (cust_id, name, street, city, pincode, DOB) VALUES (?, ?, ?, ?, ?, ?)",
      [Number(cust_id), name, street || null, city || "Unknown", pincode || null, DOB || null]
    );

    res.status(201).json({ message: "Customer added successfully" });
  } catch (error: any) {
    console.error("[POST /customers Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET Branches
router.get("/branches", async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [results]: any = await pool.execute("SELECT * FROM Branch");
    res.json(results);
  } catch (error: any) {
    console.error("[GET /branches Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST Branch
router.post("/branches", async (req: Request, res: Response) => {
  try {
    const { branch_id, name, location } = req.body;
    const pool = getPool();

    await pool.execute(
      "INSERT INTO Branch (branch_id, name, location) VALUES (?, ?, ?)",
      [Number(branch_id), name, location || null]
    );

    res.status(201).json({ message: "Branch added successfully" });
  } catch (error: any) {
    console.error("[POST /branches Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET Accounts (Queries 'Account' table)
router.get("/accounts", async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [results]: any = await pool.execute("SELECT * FROM Account");
    res.json(results);
  } catch (error: any) {
    console.error("[GET /accounts Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST Account (Inserts into 'Account' table)
router.post("/accounts", async (req: Request, res: Response) => {
  try {
    const { acc_no, type, balance, cust_id, branch_id } = req.body;
    const pool = getPool();

    await pool.execute(
      "INSERT INTO Account (acc_no, type, balance, cust_id, branch_id) VALUES (?, ?, ?, ?, ?)",
      [
        Number(acc_no),
        type,
        Number(balance) || 0.0,
        Number(cust_id),
        Number(branch_id),
      ]
    );

    res.status(201).json({ message: "Account added successfully" });
  } catch (error: any) {
    console.error("[POST /accounts Error]:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
export { router, router as dataRoutes };