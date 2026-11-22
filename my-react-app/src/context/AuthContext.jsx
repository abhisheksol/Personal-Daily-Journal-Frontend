import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'
import { tokenStore } from '../api/tokenStore'
const AuthContext = createContext(null)

const decodeUser = (token, fallback = {}) => {
  try {
    const data = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return { username: data.username || data.user_name || fallback.username || 'Journaler', firstName: data.first_name || fallback.first_name || '' }
  } catch { return { username: fallback.username || 'Journaler', firstName: fallback.first_name || '' } }
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const logout = useCallback(() => { tokenStore.clear(); setUser(null) }, [])
  useEffect(() => {
    const restore = async () => {
      const refresh = tokenStore.getRefresh()
      if (!refresh) return setLoading(false)
      try { const data = await authApi.refresh(refresh); tokenStore.set({ access: data.access, refresh: data.refresh || refresh }); setUser(decodeUser(data.access)) }
      catch { tokenStore.clear() }
      finally { setLoading(false) }
    }
    restore()
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [logout])
  const login = async (credentials) => { const data = await authApi.login(credentials); tokenStore.set(data); setUser(decodeUser(data.access, credentials)); return data }
  const register = async (payload) => { await authApi.register(payload); return login({ username: payload.username, password: payload.password }) }
  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
