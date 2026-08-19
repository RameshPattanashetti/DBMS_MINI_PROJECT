import { Express, Router } from "express";
import { analysisRoutes } from "./analysis";

// Import modules dynamically
import * as accountDetailsModule from "./account-details";
import * as customerBalanceModule from "./customer-balance";
import * as dataModule from "./data";
import * as insightsModule from "./insights";
import * as queriesModule from "./queries";
import * as textToSqlModule from "./textTosql";
import * as transactionsModule from "./transactions";

// Helper function to safely extract an Express Router
function extractRouter(mod: any): Router {
  if (typeof mod === "function") return mod;
  if (mod && typeof mod.default === "function") return mod.default;
  if (mod && typeof mod.router === "function") return mod.router;
  if (mod && typeof mod.analysisRoutes === "function") return mod.analysisRoutes;
  
  // Return an empty fallback router if the module export is missing to prevent server crashes
  const fallback = Router();
  return fallback;
}

export function setupRoutes(app: Express) {
  // 1. Dashboard Analysis Routes
  app.use("/api/analysis", extractRouter({ default: analysisRoutes }));

  // 2. AI Features
  app.use("/api/insights", extractRouter(insightsModule));

  // 3. Banking System Routes
  app.use("/api/account-details", extractRouter(accountDetailsModule));
  app.use("/api/customer-balance", extractRouter(customerBalanceModule));
  app.use("/api/data", extractRouter(dataModule));
  app.use("/api/queries", extractRouter(queriesModule));
  app.use("/api/text-to-sql", extractRouter(textToSqlModule));
  app.use("/api/transactions", extractRouter(transactionsModule));
}