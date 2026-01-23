<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useComplianceStore } from '@/stores/compliance'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import StatsCard from '@/components/StatsCard.vue'
import ComplianceChart from '@/components/ComplianceChart.vue'
import { LogOut, RefreshCw, Package, Store, CheckCircle2, TrendingUp } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const complianceStore = useComplianceStore()

onMounted(async () => {
  await complianceStore.fetchAll()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleRefresh = async () => {
  await complianceStore.fetchAll()
}

// Computed values for stats
const overallRate = computed(() => {
  const rate = complianceStore.stats?.overall?.overallComplianceRate
  return rate ? Number(rate).toFixed(2) + '%' : 'N/A'
})

const totalReports = computed(() => {
  const total = complianceStore.stats?.overall?.totalReports
  return total ? Number(total).toLocaleString() : '0'
})

const totalCompliant = computed(() => {
  const compliant = complianceStore.stats?.overall?.totalCompliant
  return compliant ? Number(compliant).toLocaleString() : '0'
})

const brandWithHighestCompliance = computed(() => {
  if (!complianceStore.stats?.byBrand.length) return 'N/A'

  const highest = complianceStore.stats.byBrand.reduce((prev, current) =>
    Number(current.complianceRate) > Number(prev.complianceRate) ? current : prev,
  )

  return `${highest.brandName} (${Number(highest.complianceRate).toFixed(2)}%)`
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 class="text-xl font-bold">Compliance Dashboard</h1>
              <p class="text-sm text-muted-foreground">
                Welcome, {{ authStore.user?.displayName }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              @click="handleRefresh"
              :disabled="complianceStore.loading"
            >
              <RefreshCw :class="['w-4 h-4 mr-2', complianceStore.loading && 'animate-spin']" />
              Refresh
            </Button>

            <Button variant="outline" size="sm" @click="handleLogout">
              <LogOut class="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div
        v-if="complianceStore.loading && !complianceStore.complianceData.length"
        class="flex items-center justify-center h-64"
      >
        <div class="text-center space-y-4">
          <RefreshCw class="w-8 h-8 mx-auto animate-spin text-primary" />
          <p class="text-muted-foreground">Loading compliance data...</p>
        </div>
      </div>

      <!-- Error State -->
      <Card v-else-if="complianceStore.error" class="p-6 bg-destructive/10">
        <p class="text-destructive">{{ complianceStore.error }}</p>
      </Card>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Overall Compliance"
            :value="overallRate"
            :icon="TrendingUp"
            description="Average across all stores"
          />

          <StatsCard
            title="Total Reports"
            :value="totalReports"
            :icon="Package"
            description="All time reports"
          />

          <StatsCard
            title="Compliant Records"
            :value="totalCompliant"
            :icon="CheckCircle2"
            description="Products in compliance"
          />

          <StatsCard
            title="Top Brand"
            :value="brandWithHighestCompliance"
            :icon="Store"
            description="Highest compliance rate"
          />
        </div>

        <!-- Main Chart -->
        <ComplianceChart
          :data="complianceStore.complianceData"
          title="Compliance Rate by Brand and Area"
        />

        <!-- Brand Performance -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Performance by Brand -->
          <Card class="p-6">
            <h3 class="text-lg font-semibold mb-4">Performance by Brand</h3>
            <div class="space-y-4">
              <div
                v-for="brand in complianceStore.stats?.byBrand"
                :key="brand.brandName"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package class="w-5 h-5 text-primary" />
                  </div>
                  <span class="font-medium">{{ brand.brandName }}</span>
                </div>
                <div class="text-right">
                  <!-- ⬇️ FIX INI -->
                  <div class="font-bold">{{ Number(brand.complianceRate).toFixed(2) }}%</div>
                  <div class="text-xs text-muted-foreground">compliance rate</div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Performance by Area -->
          <Card class="p-6">
            <h3 class="text-lg font-semibold mb-4">Performance by Area</h3>
            <div class="space-y-4">
              <div
                v-for="area in complianceStore.stats?.byArea"
                :key="area.areaName"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store class="w-5 h-5 text-primary" />
                  </div>
                  <span class="font-medium">{{ area.areaName }}</span>
                </div>
                <div class="text-right">
                  <!-- ⬇️ FIX INI -->
                  <div class="font-bold">{{ Number(area.complianceRate).toFixed(2) }}%</div>
                  <div class="text-xs text-muted-foreground">compliance rate</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Detailed Data Table -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold mb-4">Detailed Compliance Data</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b">
                <tr>
                  <th class="text-left p-3 font-semibold">Brand</th>
                  <th class="text-left p-3 font-semibold">Area</th>
                  <th class="text-right p-3 font-semibold">Compliance Rate</th>
                  <th class="text-right p-3 font-semibold">Total Records</th>
                  <th class="text-right p-3 font-semibold">Compliant</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in complianceStore.complianceData"
                  :key="index"
                  class="border-b hover:bg-muted/50"
                >
                  <td class="p-3">{{ item.brandName }}</td>
                  <td class="p-3">{{ item.areaName }}</td>
                  <td class="p-3 text-right">
                    <span
                      class="inline-block px-2 py-1 rounded-full text-sm font-semibold"
                      :class="
                        Number(item.complianceRate) >= 70
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      "
                    >
                      {{ Number(item.complianceRate).toFixed(2) }}%
                    </span>
                  </td>
                  <td class="p-3 text-right">{{ item.totalRecords }}</td>
                  <td class="p-3 text-right">{{ item.compliantRecords }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  </div>
</template>
