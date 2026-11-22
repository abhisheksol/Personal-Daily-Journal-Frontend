import axios from 'axios'
import { tokenStore } from './tokenStore'
const baseURL = import.meta.env.VITE_API_BASE_URL
const api = axios.create({ baseURL, headers: { Accept: 'application/json' } })
const refreshClient = axios.create({ baseURL, headers: { Accept: 'application/json' } })
let refreshPromise = null

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use((response) => response, async (error) => {
  const original = error.config
  if (error.response?.status !== 401 || original?._retry || original?.url?.includes('/api/token/')) throw error
  const refresh = tokenStore.getRefresh()
  if (!refresh) throw error
  original._retry = true
  refreshPromise ||= refreshClient.post('/api/token/refresh/', { refresh })
    .then(({ data }) => { tokenStore.set({ access: data.access, refresh: data.refresh || refresh }); return data.access })
    .finally(() => { refreshPromise = null })
  try {
    const access = await refreshPromise
    original.headers.Authorization = `Bearer ${access}`
    return api(original)
  } catch (refreshError) {
    tokenStore.clear(); window.dispatchEvent(new Event('auth:expired')); throw refreshError
  }
})
export const getApiError = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error.response?.data
  if (typeof data === 'string') return data
  if (data?.detail) return data.detail
  if (data && typeof data === 'object') {
    const first = Object.values(data).flat()[0]
    if (first) return String(first)
  }
  return error.code === 'ERR_NETWORK' ? 'Unable to reach the journal service. Is the Django server running?' : fallback
}
export default api
