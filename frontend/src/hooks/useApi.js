// Custom hook untuk berkomunikasi dengan Nuxt.js backend API
import { useState, useCallback } from 'react'

const BASE_URL = 'divine-dream-production-e2bf.up.railway.app'

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)
  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || 'Terjadi kesalahan pada server')
  }
  return json.data
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = useCallback(async (method, path, body = null) => {
    setLoading(true)
    setError(null)
    try {
      const data = await request(method, path, body)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getMenu: () => call('GET', '/menu'),
    getToppings: () => call('GET', '/toppings'),
    getTransactions: (filter) => call('GET', `/transactions${filter ? `?filter=${filter}` : ''}`),
    postTransaction: (trx) => call('POST', '/transactions', trx),
    deleteTransaction: (id) => call('DELETE', `/transactions/${id}`),
  }
}
