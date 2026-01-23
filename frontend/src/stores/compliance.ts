import { defineStore } from 'pinia'
import { ref } from 'vue'
import { complianceApi } from '@/services/api'
import type { ComplianceData, StatsResponse, Brand, Area } from '@/types'

export const useComplianceStore = defineStore('compliance', () => {
  const complianceData = ref<ComplianceData[]>([])
  const stats = ref<StatsResponse | null>(null)
  const brands = ref<Brand[]>([])
  const areas = ref<Area[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref({
    areaId: 'all',
    startDate: '',
    endDate: '',
  })

  // Fetch compliance by brand and area
  const fetchComplianceData = async (filterParams = filters.value) => {
    loading.value = true
    error.value = null
    try {
      const response = await complianceApi.getByBrandAndArea(filterParams)
      complianceData.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch compliance data'
      console.error('Error fetching compliance data:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch overall statistics
  const fetchStats = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await complianceApi.getStats()
      if (response.success) {
        stats.value = response.data
      }
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to fetch statistics'
      console.error('Error fetching stats:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const response = await complianceApi.getBrands()
      if (response.success) {
        brands.value = response.data
      }
    } catch (err: unknown) {
      console.error('Error fetching brands:', err)
    }
  }

  // Fetch areas
  const fetchAreas = async () => {
    try {
      const response = await complianceApi.getAreas()
      if (response.success) {
        areas.value = response.data
      }
    } catch (err: unknown) {
      console.error('Error fetching areas:', err)
    }
  }

  // Fetch all data
  const fetchAll = async () => {
    await Promise.all([fetchComplianceData(), fetchStats(), fetchBrands(), fetchAreas()])
  }

  return {
    complianceData,
    stats,
    brands,
    areas,
    loading,
    error,
    fetchComplianceData,
    fetchStats,
    fetchBrands,
    fetchAreas,
    fetchAll,
  }
})
