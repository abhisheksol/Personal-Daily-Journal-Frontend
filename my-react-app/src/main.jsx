import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { JournalProvider } from './context/JournalContext'
import { ToastProvider } from './components/ui/Toast'
import App from './App'
import './index.css'
import './responsive.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider><ToastProvider><AuthProvider><JournalProvider><App /></JournalProvider></AuthProvider></ToastProvider></ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
