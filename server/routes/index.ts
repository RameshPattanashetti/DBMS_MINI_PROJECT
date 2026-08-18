import type { Express } from "express"
import { queryRoutes } from "./queries"
import { dataRoutes } from "./data"
import { analysisRoutes } from "./analysis"
import { transactionRoutes } from "./transactions"
import { accountDetailsRoutes } from "./account-details"
import { customerBalanceRoutes } from "./customer-balance"

export function setupRoutes(app: Express) {
  // Query endpoints
  app.use("/api/queries", queryRoutes)

  // Data management endpoints
  app.use("/api/data", dataRoutes)

  // Analysis endpoints
  app.use("/api/analysis", analysisRoutes)

  // Transaction endpoints for deposit, withdraw, and balance check
  app.use("/api/transactions", transactionRoutes)

  // Account details endpoints
  app.use("/api/account-details", accountDetailsRoutes)

  app.use("/api/customer-balance", customerBalanceRoutes)

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" })
  })
}
