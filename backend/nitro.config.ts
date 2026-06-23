// nitro.config.ts — Backend API Server untuk POS Jasuke
// Nitro adalah server engine resmi dari Vue/Nuxt ecosystem
// Handle CORS preflight + responses untuk React frontend
import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  compatibilityDate: '2025-01-01',

  handlers: [
    {
      route: '/api/**',
      handler: '~/middleware/cors.ts',
      middleware: true
    }
  ]
})