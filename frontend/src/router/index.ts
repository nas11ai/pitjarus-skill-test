import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize
  if (authStore.loading) {
    await authStore.initAuth()
  }

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = !!authStore.user

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if already logged in and trying to access login
    next('/dashboard')
  } else {
    next()
  }
})

export default router
