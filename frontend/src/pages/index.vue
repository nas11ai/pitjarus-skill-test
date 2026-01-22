<script setup lang="ts">
import { useRouter } from 'vue-router'
import { BarChart3, Shield, TrendingUp, Users } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'

const router = useRouter()

const features = [
  {
    icon: BarChart3,
    title: 'Interactive Charts',
    description: 'Visualize compliance data with beautiful, interactive charts powered by Unovis',
  },
  {
    icon: Shield,
    title: 'Real-time Monitoring',
    description: 'Track product compliance across multiple stores and regions in real-time',
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    description: 'Analyze trends and patterns to improve compliance rates',
  },
]
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-background to-muted">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center space-y-6 mb-16">
        <div class="inline-block">
          <div
            class="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
          >
            <Shield class="w-4 h-4" />
            <span>Product Compliance Dashboard</span>
          </div>
        </div>

        <h1 class="text-5xl md:text-6xl font-bold tracking-tight">
          Monitor Compliance <br />
          <span class="text-primary">Across All Stores</span>
        </h1>

        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track and analyze product compliance rates across different brands and regions.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" @click="router.push('/login')" class="text-lg px-8">
            Get Started
            <BarChart3 class="ml-2 w-5 h-5" />
          </Button>

          <Button size="lg" variant="outline" class="text-lg px-8"> Learn More </Button>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="flex flex-wrap justify-center gap-6 mt-16">
        <Card
          v-for="(feature, index) in features"
          :key="index"
          class="p-6 hover:shadow-lg transition-shadow w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
        >
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <component :is="feature.icon" class="w-6 h-6 text-primary" />
            </div>

            <h3 class="text-lg font-semibold">
              {{ feature.title }}
            </h3>

            <p class="text-muted-foreground text-sm">
              {{ feature.description }}
            </p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
