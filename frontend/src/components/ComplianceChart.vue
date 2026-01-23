<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisGroupedBar, VisAxis, VisTooltip } from '@unovis/vue'
import Card from '@/components/ui/card/Card.vue'
import type { ComplianceData } from '@/types'

interface Props {
  data: ComplianceData[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Compliance Rate by Brand and Area',
})

// Transform data for the chart
const chartData = computed(() => {
  const areaMap = new Map<string, any>()

  props.data.forEach((item) => {
    if (!areaMap.has(item.areaName)) {
      areaMap.set(item.areaName, { area: item.areaName })
    }

    const areaData = areaMap.get(item.areaName)!
    areaData[item.brandName] = Number(item.complianceRate)
  })

  return Array.from(areaMap.values())
})

// Get unique brand names
const brands = computed(() => {
  return Array.from(new Set(props.data.map((d) => d.brandName)))
})

// Chart colors for each brand
const chartColors = {
  'ROTI TAWAR': 'var(--chart-1)',
  'SUSU KALENG': 'var(--chart-2)',
}

const getColor = (brandName: string) =>
  chartColors[brandName as keyof typeof chartColors] || 'var(--chart-3)'

// Prepare y accessors for each brand
const yAccessors = computed(() => brands.value.map((brand) => (d: any) => d[brand] || 0))

// Prepare colors for each brand
const colors = computed(() => brands.value.map((brand) => getColor(brand)))

// Format tooltip
const tooltipTemplate = (d: any) => {
  const area = d.area
  let html = `<div class="p-2 bg-white dark:bg-gray-800 rounded shadow-lg border">
    <div class="font-semibold mb-2">${area}</div>`

  brands.value.forEach((brand) => {
    const value = d[brand]
    if (value !== undefined) {
      html += `<div class="flex items-center gap-2 text-sm">
        <span class="w-3 h-3 rounded" style="background-color: ${getColor(brand)}"></span>
        <span>${brand}:</span>
        <span class="font-semibold">${value.toFixed(2)}%</span>
      </div>`
    }
  })

  html += '</div>'
  return html
}
</script>

<template>
  <Card class="p-6">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>

    <div class="w-full h-100">
      <VisXYContainer
        :data="chartData"
        :height="400"
        :padding="{ top: 10, bottom: 40, left: 60, right: 20 }"
      >
        <VisGroupedBar
          :x="(d: any) => d.area"
          :y="yAccessors"
          :color="colors"
          :roundedCorners="4"
          :barPadding="0.2"
          :groupPadding="0.1"
        />

        <VisAxis type="x" :tick-line="false" :grid-line="false" :domain-line="true" label="Area" />

        <VisAxis
          type="y"
          :tick-line="false"
          :grid-line="true"
          :domain-line="false"
          label="Compliance Rate (%)"
          :num-ticks="5"
        />

        <VisTooltip
          :triggers="{
            rect: tooltipTemplate,
          }"
        />
      </VisXYContainer>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 mt-4">
      <div v-for="brand in brands" :key="brand" class="flex items-center gap-2">
        <span class="w-4 h-4 rounded" :style="{ backgroundColor: getColor(brand) }" />
        <span class="text-sm">{{ brand }}</span>
      </div>
    </div>
  </Card>
</template>
