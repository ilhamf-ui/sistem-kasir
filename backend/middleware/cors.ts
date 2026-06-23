// CORS middleware untuk semua /api/** routes
export default defineEventHandler((event) => {
  const origin = getRequestHeader(event, 'origin') || ''
  
  // Allow React dev server & production
  const allowed = ['http://localhost:5173', 'http://localhost:4173']
  
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  // Handle preflight
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
  }
})
