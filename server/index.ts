import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { setupRoutes } from "./routes";
import { initializeDatabase } from "./db";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Bank Management Backend is running",
    timestamp: new Date().toISOString(),
  });
});

setupRoutes(app);

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
      console.log(`?? Backend server running on http://localhost:${PORT}`);
      console.log(`==================================================\n`);
    });
  } catch (error: any) {
    console.error("? Failed to start server:", error.message);
  }
}

startServer();
