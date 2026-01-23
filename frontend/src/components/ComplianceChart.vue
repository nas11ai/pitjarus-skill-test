<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/card/Card.vue'
import type { ComplianceData } from '@/types'

interface Props {
  data: ComplianceData[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Compliance Rate by Brand and Area',
})

// Group by area
const chartData = computed(() => {
  const areaMap = new Map<
    string,
    { area: string; brands: { name: string; value: number; color: string }[] }
  >()

  props.data.forEach((item) => {
    if (!areaMap.has(item.areaName)) {
      areaMap.set(item.areaName, { area: item.areaName, brands: [] })
    }

    const color = item.brandName === 'ROTI TAWAR' ? 'bg-blue-500' : 'bg-amber-500'

    areaMap.get(item.areaName)!.brands.push({
      name: item.brandName,
      value: parseFloat(item.complianceRate.toString()),
      color,
    })
  })

  return Array.from(areaMap.values())
})

const maxValue = 100 // Compliance rate max is 100%
</script>

<template>
  <Card class="p-6">
    <h3 class="text-lg font-semibold mb-6">{{ title }}</h3>

    <div class="space-y-8">
      <!-- Each Area -->
      <div v-for="item in chartData" :key="item.area" class="space-y-3">
        <div class="font-medium text-sm text-muted-foreground">{{ item.area }}</div>

        <!-- Bars for each brand -->
        <div class="space-y-2">
          <div v-for="brand in item.brands" :key="brand.name" class="flex items-center gap-3">
            <!-- Brand Name -->
            <div class="w-32 text-sm font-medium">{{ brand.name }}</div>

            <!-- Bar -->
            <div class="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
              <div
                :class="brand.color"
                class="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                :style="{ width: `${(brand.value / maxValue) * 100}%` }"
              >
                <span class="text-xs font-bold text-white"> {{ brand.value.toFixed(2) }}% </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 mt-8 pt-4 border-t">
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded bg-blue-500" />
        <span class="text-sm">ROTI TAWAR</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded bg-amber-500" />
        <span class="text-sm">SUSU KALENG</span>
      </div>
    </div>
  </Card>
</template>
