import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import notesRouter from "./routes/notes";
import { initializeDatabase } from "./db";

export async function createServer() {
  const app = express();

  // Initialize database on startup
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    // Continue anyway - routes will return errors if DB is unavailable
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Notes API routes
  app.use("/api", notesRouter);

  return app;
}
