import { Router } from "express";
import complianceRoutes from "./compliance.route.ts";

const router = Router();

// API routes
router.use("/compliance", complianceRoutes);

// Health check
router.get("/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default router;
