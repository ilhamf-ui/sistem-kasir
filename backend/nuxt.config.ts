// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // API-only mode - no Vue pages needed
  ssr: false,
  
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    }
  },
  
  devtools: { enabled: false }
})
