import api from './axiosClient'
const normalizeList = (data) => Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
export const journalApi = {
  async listAll() {
    let url = '/journal/daily-entries/'
    const entries = []
    do {
      const { data } = await api.get(url)
      entries.push(...normalizeList(data))
      url = Array.isArray(data) || !data || typeof data !== 'object' ? null : data.next || null
      if (url?.startsWith(import.meta.env.VITE_API_BASE_URL)) url = url.slice(import.meta.env.VITE_API_BASE_URL.length)
    } while (url)
    return entries
  },
  get: (id) => api.get(`/journal/daily-entries/${id}/`).then((r) => r.data),
  create: (payload) => api.post('/journal/daily-entries/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/journal/daily-entries/${id}/`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/journal/daily-entries/${id}/`),
}
