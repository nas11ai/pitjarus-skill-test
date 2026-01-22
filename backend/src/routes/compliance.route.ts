import { Router } from "express";
import { ComplianceController } from "../controllers/compliance.controller.ts";
// import { authenticateUser } from "../middleware/auth.ts";

const router = Router();
const controller = new ComplianceController();

// Protected routes - require authentication
// router.use(authenticateUser);

// Get compliance by brand and area
router.get("/brand-area", controller.getComplianceByBrandAndArea);

// Get compliance by date range
router.get("/date-range", controller.getComplianceByDateRange);

// Get overall statistics
router.get("/stats", controller.getOverallStats);

// Get brands list
router.get("/brands", controller.getBrands);

// Get areas list
router.get("/areas", controller.getAreas);

export default router;
