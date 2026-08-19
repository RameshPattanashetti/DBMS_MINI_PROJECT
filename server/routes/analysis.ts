import { Router, type Request, type Response } from "express";
import { getPool } from "../db";

const router = Router();

// 1. Branch Dropdown Endpoint
router.get("/branches", async (req: Request, res: Response) => {
  let connection;
  try {
    const pool = getPool();
    connection = await pool.getConnection();

    const query = `
      SELECT 
        branch_id, 
        branch_id AS id, 
        name, 
        location 
      FROM Branch 
      ORDER BY name ASC
    `;

    const [results]: any = await connection.execute(query);
    res.json(results);
  } catch (error: any) {
    console.error("[Analysis Route Error - Branches]:", error.message);
    res.status(500).json({ error: "Failed to fetch branches from database" });
  } finally {
    if (connection) connection.release();
  }
});

// 2. Branch Account Summary (Fixes BranchSummary Component)
router.get("/branch-summary/:branch_id", async (req: Request, res: Response) => {
  let connection;
  try {
    const { branch_id } = req.params;
    const pool = getPool();
    connection = await pool.getConnection();

    const query = `
      SELECT
        B.name AS Branch_Name,
        B.location AS Branch_Location,
        COUNT(A.acc_no) AS Total_Accounts,
        COALESCE(SUM(A.balance), 0.00) AS Total_Balance_Value
      FROM Branch B
      LEFT JOIN Account A ON B.branch_id = A.branch_id
      WHERE B.branch_id = ?
      GROUP BY B.branch_id, B.name, B.location
    `;

    const [results]: any = await connection.execute(query, [branch_id]);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json(results[0]);
  } catch (error: any) {
    console.error("[Analysis Route Error - Branch Summary]:", error.message);
    res.status(500).json({ error: "Failed to fetch branch summary" });
  } finally {
    if (connection) connection.release();
  }
});

// 3. Branch Profitability Route
router.get("/branch-profitability", async (req: Request, res: Response) => {
  let connection;
  try {
    const pool = getPool();
    connection = await pool.getConnection();

    const query = `
      SELECT
        B.name AS Branch_Name,
        COALESCE(SUM(A.balance), 0.00) AS Total_Balance_Value,
        COUNT(A.acc_no) AS Total_Accounts,
        CASE 
          WHEN COUNT(A.acc_no) >= 2 THEN 'High Activity' 
          ELSE 'Low Activity' 
        END AS Activity_Level
      FROM Branch B
      LEFT JOIN Account A ON B.branch_id = A.branch_id
      GROUP BY B.branch_id, B.name
      ORDER BY Total_Balance_Value DESC
    `;

    const [results]: any = await connection.execute(query);
    res.json(results);
  } catch (error: any) {
    console.error("[Analysis Route Error - Profitability]:", error.message);
    res.status(500).json({ error: "Failed to fetch branch profitability" });
  } finally {
    if (connection) connection.release();
  }
});

// 4. Employee Cost Efficiency Route
router.get("/employee-efficiency", async (req: Request, res: Response) => {
  let connection;
  try {
    const pool = getPool();
    connection = await pool.getConnection();

    const query = `
      SELECT
        B.name AS Branch_Name,
        COALESCE(SUM(E.salary), 0.00) AS Total_Branch_Salary_Cost,
        COUNT(DISTINCT A.cust_id) AS Total_Customers_Served,
        ROUND(
          COALESCE(SUM(E.salary), 0.00) / NULLIF(COUNT(DISTINCT A.cust_id), 0), 2
        ) AS Cost_Per_Customer
      FROM Branch B
      LEFT JOIN Employee E ON B.branch_id = E.branch_id
      LEFT JOIN Account A ON B.branch_id = A.branch_id
      GROUP BY B.branch_id, B.name
      ORDER BY Branch_Name ASC
    `;

    const [results]: any = await connection.execute(query);
    res.json(results);
  } catch (error: any) {
    console.error("[Analysis Route Error - Efficiency]:", error.message);
    res.status(500).json({ error: "Failed to fetch employee efficiency metrics" });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
export { router, router as analysisRoutes };