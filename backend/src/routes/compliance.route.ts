import type { Request, Response } from "express";
import { db } from "../db/index.ts";
import {
  reportProduct,
  product,
  productBrand,
  store,
  storeArea,
} from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";

export class ComplianceController {
  /**
   * Get compliance rate per brand per area
   * Formula: SUM(compliance) / Total ROW * 100
   */
  async getComplianceByBrandAndArea(_: Request, res: Response) {
    try {
      const result = await db
        .select({
          brandName: productBrand.brandName,
          areaName: storeArea.areaName,
          complianceRate: sql<number>`ROUND((SUM(${reportProduct.compliance}) / COUNT(*)) * 100, 2)`,
          totalRecords: sql<number>`COUNT(*)`,
          compliantRecords: sql<number>`SUM(${reportProduct.compliance})`,
        })
        .from(reportProduct)
        .innerJoin(product, eq(reportProduct.productId, product.productId))
        .innerJoin(productBrand, eq(product.brandId, productBrand.brandId))
        .innerJoin(store, eq(reportProduct.storeId, store.storeId))
        .innerJoin(storeArea, eq(store.areaId, storeArea.areaId))
        .groupBy(productBrand.brandName, storeArea.areaName)
        .orderBy(productBrand.brandName, storeArea.areaName);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error fetching compliance data:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch compliance data",
      });
    }
  }

  /**
   * Get compliance rate by date range
   */
  async getComplianceByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: "Start date and end date are required",
        });
      }

      const result = await db
        .select({
          tanggal: reportProduct.tanggal,
          brandName: productBrand.brandName,
          areaName: storeArea.areaName,
          complianceRate: sql<number>`ROUND((SUM(${reportProduct.compliance}) / COUNT(*)) * 100, 2)`,
        })
        .from(reportProduct)
        .innerJoin(product, eq(reportProduct.productId, product.productId))
        .innerJoin(productBrand, eq(product.brandId, productBrand.brandId))
        .innerJoin(store, eq(reportProduct.storeId, store.storeId))
        .innerJoin(storeArea, eq(store.areaId, storeArea.areaId))
        .where(
          sql`${reportProduct.tanggal} BETWEEN ${startDate} AND ${endDate}`,
        )
        .groupBy(
          reportProduct.tanggal,
          productBrand.brandName,
          storeArea.areaName,
        )
        .orderBy(reportProduct.tanggal, productBrand.brandName);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error fetching compliance data by date:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch compliance data",
      });
    }
  }

  /**
   * Get overall compliance statistics
   */
  async getOverallStats(_: Request, res: Response) {
    try {
      const stats = await db
        .select({
          totalReports: sql<number>`COUNT(*)`,
          totalCompliant: sql<number>`SUM(${reportProduct.compliance})`,
          overallComplianceRate: sql<number>`ROUND((SUM(${reportProduct.compliance}) / COUNT(*)) * 100, 2)`,
        })
        .from(reportProduct);

      const brandStats = await db
        .select({
          brandName: productBrand.brandName,
          complianceRate: sql<number>`ROUND((SUM(${reportProduct.compliance}) / COUNT(*)) * 100, 2)`,
        })
        .from(reportProduct)
        .innerJoin(product, eq(reportProduct.productId, product.productId))
        .innerJoin(productBrand, eq(product.brandId, productBrand.brandId))
        .groupBy(productBrand.brandName);

      const areaStats = await db
        .select({
          areaName: storeArea.areaName,
          complianceRate: sql<number>`ROUND((SUM(${reportProduct.compliance}) / COUNT(*)) * 100, 2)`,
        })
        .from(reportProduct)
        .innerJoin(store, eq(reportProduct.storeId, store.storeId))
        .innerJoin(storeArea, eq(store.areaId, storeArea.areaId))
        .groupBy(storeArea.areaName);

      return res.json({
        success: true,
        data: {
          overall: stats[0],
          byBrand: brandStats,
          byArea: areaStats,
        },
      });
    } catch (error) {
      console.error("Error fetching overall stats:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch statistics",
      });
    }
  }

  /**
   * Get list of brands
   */
  async getBrands(_: Request, res: Response) {
    try {
      const brands = await db.select().from(productBrand);
      return res.json({
        success: true,
        data: brands,
      });
    } catch (error) {
      console.error("Error fetching brands:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch brands",
      });
    }
  }

  /**
   * Get list of areas
   */
  async getAreas(_: Request, res: Response) {
    try {
      const areas = await db.select().from(storeArea);
      return res.json({
        success: true,
        data: areas,
      });
    } catch (error) {
      console.error("Error fetching areas:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch areas",
      });
    }
  }
}
