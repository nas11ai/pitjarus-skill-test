import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'

function pascalToKebab(str: string) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
      extensions: ['.vue'],
      getRouteName: (routeNode) => {
        const segment = routeNode.value.rawSegment

        if (segment === 'index' || segment === 'Index') {
          return routeNode.parent ? pascalToKebab(segment) : 'index'
        }

        return pascalToKebab(segment)
      },
      extendRoute(route) {
        if (route.name === 'index') {
          route.path = '/'
        }
        else if (route.path) {
          route.path = route.path
            .split('/')
            .map((segment) => {
              if (!segment || segment.startsWith(':')) return segment
              return pascalToKebab(segment)
            })
            .join('/')
        }
      },
      dts: './typed-router.d.ts',
    }),
    vue(),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
