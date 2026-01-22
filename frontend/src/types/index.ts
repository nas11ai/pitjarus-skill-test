export interface ComplianceData {
  brandName: string
  areaName: string
  complianceRate: number
  totalRecords: number
  compliantRecords: number
}

export interface OverallStats {
  totalReports: number
  totalCompliant: number
  overallComplianceRate: number
}

export interface BrandStats {
  brandName: string
  complianceRate: number
}

export interface AreaStats {
  areaName: string
  complianceRate: number
}

export interface StatsResponse {
  overall: OverallStats
  byBrand: BrandStats[]
  byArea: AreaStats[]
}

export interface Brand {
  brandId: number
  brandName: string
}

export interface Area {
  areaId: number
  areaName: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}
