<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  change?: number
  icon?: any
  description?: string
}

const props = defineProps<Props>()

const changeIcon = computed(() => {
  if (!props.change) return Minus
  return props.change > 0 ? TrendingUp : TrendingDown
})

const changeColor = computed(() => {
  if (!props.change) return 'text-muted-foreground'
  return props.change > 0 ? 'text-green-600' : 'text-red-600'
})
</script>

<template>
  <Card class="p-6">
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
        <p class="text-2xl font-bold">{{ value }}</p>
        <p v-if="description" class="text-xs text-muted-foreground">
          {{ description }}
        </p>
      </div>

      <component v-if="icon" :is="icon" class="w-8 h-8 text-muted-foreground" />
    </div>

    <div v-if="change !== undefined" class="mt-4 flex items-center gap-1">
      <component :is="changeIcon" :class="['w-4 h-4', changeColor]" />
      <span :class="['text-sm font-medium', changeColor]"> {{ Math.abs(change) }}% </span>
      <span class="text-sm text-muted-foreground ml-1"> from last period </span>
    </div>
  </Card>
</template>
