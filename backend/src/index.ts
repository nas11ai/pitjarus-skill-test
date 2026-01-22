import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import routes from "./routes/index.ts";
import type { Request, Response, NextFunction } from "express";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 3000;

// Middleware
app.use(cors({
  origin: process.env["FRONTEND_URL"] || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_: Request, res: Response) => {
  res.json({
    message: 'Product Compliance API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      compliance: '/api/compliance/*',
    },
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env["NODE_ENV"] === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env["NODE_ENV"] || "development"}`);
});

export default app;
