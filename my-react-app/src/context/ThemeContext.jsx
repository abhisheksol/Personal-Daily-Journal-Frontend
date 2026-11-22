import { createContext, useContext, useEffect, useMemo, useState } from 'react'
const ThemeContext = createContext(null)
const readChoice = () => { try { return localStorage.getItem('journal_theme') || 'system' } catch { return 'system' } }
const resolveTheme = (choice) => choice === 'system'
  ? (window.matchMedia?.('(prefers-color-scheme: light)')?.matches ? 'light' : 'dark')
  : choice
export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(readChoice)
  const [theme, setTheme] = useState(() => resolveTheme(readChoice()))
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: light)')
    const apply = () => setTheme(resolveTheme(choice))
    apply()
    media?.addEventListener?.('change', apply)
    return () => media?.removeEventListener?.('change', apply)
  }, [choice])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('journal_theme', choice) } catch { /* Storage may be disabled by the browser. */ }
  }, [theme, choice])
  const value = useMemo(() => ({ theme, choice, setChoice, toggleTheme: () => setChoice((t) => t === 'dark' ? 'light' : 'dark') }), [theme, choice])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export const useTheme = () => useContext(ThemeContext)
