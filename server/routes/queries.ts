import { Router, type Request, type Response } from "express";
import { getPool } from "../db";

const router = Router();

// Helper to execute query safely
async function runQuery(query: string, res: Response) {
  let connection;
  try {
    const pool = getPool();
    connection = await pool.getConnection();
    const [results]: any = await connection.execute(query);
    res.json(results);
  } catch (error: any) {
    console.error("[Query Route Error]:", error.message);
    res.status(500).json({ error: error.message || "Query execution failed" });
  } finally {
    if (connection) connection.release();
  }
}

// 1. High-Value Customers
const highValueQuery = `
  SELECT
    C.name AS Customer_Name,
    C.cust_id,
    SUM(L.amount) AS Total_Loan_Amount,
    GROUP_CONCAT(DISTINCT LR.size ORDER BY FIELD(LR.size, 'Extra Large', 'Large', 'Medium', 'Small')) AS Locker_Sizes
  FROM Customer C
  JOIN Loan L ON C.cust_id = L.cust_id
  JOIN Locker LR ON C.cust_id = LR.cust_id
  GROUP BY C.cust_id, C.name
  HAVING SUM(L.amount) > 1000000.00
     AND SUM(CASE WHEN LR.size IN ('Large', 'Extra Large') THEN 1 ELSE 0 END) > 0
`;
router.post("/high-value-customers", (req, res) => runQuery(highValueQuery, res));
router.get("/high-value-customers", (req, res) => runQuery(highValueQuery, res));

// 2. Branches Without Recurring Deposit Account Type
const branchesWithoutAccTypeQuery = `
  SELECT
    B.name AS Branch_Name,
    B.location
  FROM Branch B
  WHERE B.branch_id NOT IN (
    SELECT DISTINCT branch_id FROM Account
    WHERE type = 'Recurring Deposit'
  )
`;
router.post("/branches-without-account-type", (req, res) => runQuery(branchesWithoutAccTypeQuery, res));
router.get("/branches-without-account-type", (req, res) => runQuery(branchesWithoutAccTypeQuery, res));

// 3. Financially Stressed Customers
const stressedCustomersQuery = `
  SELECT
    C.name AS Customer_Name,
    L.Total_Loan_Amount,
    COALESCE(SUM(A.balance), 0.00) AS Total_Account_Balance
  FROM Customer C
  JOIN (
    SELECT cust_id, SUM(amount) AS Total_Loan_Amount
    FROM Loan
    GROUP BY cust_id
  ) L ON C.cust_id = L.cust_id
  LEFT JOIN Account A ON C.cust_id = A.cust_id
  GROUP BY C.cust_id, C.name, L.Total_Loan_Amount
  HAVING L.Total_Loan_Amount > Total_Account_Balance
  ORDER BY L.Total_Loan_Amount DESC
`;
router.post("/stressed-customers", (req, res) => runQuery(stressedCustomersQuery, res));
router.get("/stressed-customers", (req, res) => runQuery(stressedCustomersQuery, res));

// 4. Employees in the Least Active Branch
const leastActiveBranchQuery = `
  SELECT
    E.name AS Employee_Name,
    E.position,
    B.name AS Branch_Name
  FROM Employee E
  JOIN Branch B ON E.branch_id = B.branch_id
  WHERE E.branch_id = (
    SELECT branch_id FROM Account
    GROUP BY branch_id
    ORDER BY SUM(balance) ASC
    LIMIT 1
  )
  ORDER BY E.position, E.name
`;
router.post("/least-active-branch-employees", (req, res) => runQuery(leastActiveBranchQuery, res));
router.get("/least-active-branch-employees", (req, res) => runQuery(leastActiveBranchQuery, res));

// 5. Digital Adoption Gap
const digitalAdoptionGapQuery = `
  WITH DigitalCustomers AS (
    SELECT DISTINCT A.cust_id
    FROM Avails A
    JOIN Service S ON A.service_id = S.service_id
    WHERE S.type = 'Digital'
  )
  SELECT
    C.name AS Customer_Name,
    C.cust_id
  FROM Customer C
  JOIN DigitalCustomers DC ON C.cust_id = DC.cust_id
  WHERE C.cust_id NOT IN (
    SELECT DISTINCT ACC.cust_id
    FROM Account ACC
    JOIN Transaction T ON ACC.acc_no = T.acc_no
    WHERE T.mode = 'Online'
  )
`;
router.post("/digital-adoption-gap", (req, res) => runQuery(digitalAdoptionGapQuery, res));
router.get("/digital-adoption-gap", (req, res) => runQuery(digitalAdoptionGapQuery, res));

// 6. Branch Dropdown Options
const branchesQuery = `
  SELECT 
    branch_id, 
    branch_id AS id, 
    name, 
    location 
  FROM Branch 
  ORDER BY name ASC
`;
router.get("/branches", (req, res) => runQuery(branchesQuery, res));
router.post("/branches", (req, res) => runQuery(branchesQuery, res));

export default router;
export { router, router as queryRoutes };