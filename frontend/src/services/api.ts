import axios from 'axios'
import { auth } from '@/lib/firebase'
import type { ApiResponse, ComplianceData, StatsResponse, Brand, Area } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const complianceApi = {
  // Get compliance by brand and area
  getByBrandAndArea: async (params?: { areaId?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams()

    if (params?.areaId && params.areaId !== 'all') {
      queryParams.append('areaId', params.areaId)
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate)
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate)
    }

    const queryString = queryParams.toString()
    const url = `/compliance/brand-area${queryString ? `?${queryString}` : ''}`

    const response = await api.get<ApiResponse<ComplianceData[]>>(url)
    console.log('Compliance Data Response:', response.data)
    return response.data
  },

  // Get compliance by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get<ApiResponse<ComplianceData[]>>('/compliance/date-range', {
      params: { startDate, endDate },
    })
    return response.data
  },

  // Get overall statistics
  getStats: async () => {
    const response = await api.get<ApiResponse<StatsResponse>>('/compliance/stats')
    return response.data
  },

  // Get brands
  getBrands: async () => {
    const response = await api.get<ApiResponse<Brand[]>>('/compliance/brands')
    return response.data
  },

  // Get areas
  getAreas: async () => {
    const response = await api.get<ApiResponse<Area[]>>('/compliance/areas')
    return response.data
  },
}

export default api
