import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, X, AlertCircle } from 'lucide-react'
const ToastContext = createContext(null)
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])
  return <ToastContext.Provider value={showToast}>{children}<div className="toast-stack" aria-live="polite"><AnimatePresence>{toasts.map((t) => <motion.div key={t.id} className={`toast ${t.type}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }}>{t.type === 'error' ? <AlertCircle /> : <CheckCircle2 />}<span>{t.message}</span><button onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))} aria-label="Dismiss"><X /></button></motion.div>)}</AnimatePresence></div></ToastContext.Provider>
}
export const useToast = () => useContext(ToastContext)
