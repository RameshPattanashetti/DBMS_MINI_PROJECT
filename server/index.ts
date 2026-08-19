import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { setupRoutes } from "./routes";
import { initializeDatabase } from "./db";

const app = express();

// Enable CORS for Next.js frontend running on localhost:3000
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Global Request Logger to track incoming API calls in terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Fallback health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Bank Management Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Attach all registered application routes from server/routes/index.ts
setupRoutes(app);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Backend Error:", err.stack || err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📊 Analytics API:   GET  http://localhost:${PORT}/api/analysis/branch-profitability`);
      console.log(`🔗 Text-to-SQL API: POST http://localhost:${PORT}/api/insights/query-ai`);
      console.log(`🔗 AI Insights API: GET  http://localhost:${PORT}/api/insights/:cust_id`);
      console.log(`==================================================\n`);
    });
  } catch (error: any) {
    console.error("❌ Failed to start server:", error.message);
  }
}

startServer();