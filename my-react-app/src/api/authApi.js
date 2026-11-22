import api from './axiosClient'
export const authApi = {
  login: (credentials) => api.post('/api/token/', credentials).then((r) => r.data),
  register: (payload) => api.post('/accounts/users/', payload).then((r) => r.data),
  refresh: (refresh) => api.post('/api/token/refresh/', { refresh }).then((r) => r.data),
}
