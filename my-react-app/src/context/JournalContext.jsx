import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { journalApi } from '../api/journalApi'
import { isValid, parseISO } from 'date-fns'
import { useAuth } from './AuthContext'
const JournalContext = createContext(null)
export function JournalProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true); setError('')
    try {
      const result = await journalApi.listAll()
      setEntries(Array.isArray(result) ? result.filter((entry) => entry && typeof entry === 'object' && typeof entry.date === 'string' && isValid(parseISO(entry.date))) : [])
    } catch (e) { setError(e) } finally { setLoading(false) }
  }, [isAuthenticated])
  useEffect(() => { if (isAuthenticated) refresh(); else setEntries([]) }, [isAuthenticated, refresh])
  const save = async (entry, payload) => {
    const existing = entry || entries.find((item) => item.date === payload.date)
    const saved = existing ? await journalApi.update(existing.id, payload) : await journalApi.create(payload)
    setEntries((current) => existing ? current.map((e) => String(e.id) === String(saved.id) ? saved : e) : [saved, ...current])
    return saved
  }
  const remove = async (id) => { await journalApi.remove(id); setEntries((e) => e.filter((item) => item.id !== id)) }
  const value = useMemo(() => ({ entries, loading, error, refresh, save, remove }), [entries, loading, error, refresh])
  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
}
export const useJournal = () => useContext(JournalContext)
