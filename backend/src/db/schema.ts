import { mysqlTable, int, varchar, date } from "drizzle-orm/mysql-core";

export const productBrand = mysqlTable("product_brand", {
  brandId: int("brand_id").primaryKey().autoincrement(),
  brandName: varchar("brand_name", { length: 20 }).notNull(),
});

export const product = mysqlTable("product", {
  productId: int("product_id").primaryKey().autoincrement(),
  productName: varchar("product_name", { length: 50 }).notNull(),
  brandId: int("brand_id").notNull(),
});

export const storeAccount = mysqlTable("store_account", {
  accountId: int("account_id").primaryKey().autoincrement(),
  accountName: varchar("account_name", { length: 50 }).notNull(),
});

export const storeArea = mysqlTable("store_area", {
  areaId: int("area_id").primaryKey().autoincrement(),
  areaName: varchar("area_name", { length: 50 }).notNull(),
});

export const store = mysqlTable("store", {
  storeId: int("store_id").primaryKey().autoincrement(),
  storeName: varchar("store_name", { length: 50 }).notNull(),
  accountId: int("account_id").notNull(),
  areaId: int("area_id").notNull(),
  isActive: int("is_active").notNull(),
});

export const reportProduct = mysqlTable("report_product", {
  reportId: int("report_id").primaryKey().autoincrement(),
  storeId: int("store_id").notNull(),
  productId: int("product_id").notNull(),
  compliance: int("compliance").notNull(),
  tanggal: date("tanggal").notNull(),
});
