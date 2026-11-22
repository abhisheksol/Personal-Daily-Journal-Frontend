import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { useAuth } from './context/AuthContext'
import { PageLoader } from './components/ui/States'
import AppLayout from './components/layout/AppLayout'
import RouteErrorBoundary from './components/ui/RouteErrorBoundary'

const Landing = lazy(() => import('./pages/Landing'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const TodayJournal = lazy(() => import('./pages/TodayJournal'))
const History = lazy(() => import('./pages/History'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const EntryDetail = lazy(() => import('./pages/EntryDetail'))
const Insights = lazy(() => import('./pages/Insights'))
const Settings = lazy(() => import('./pages/Settings'))

function Protected({ children }) {
  const { loading, isAuthenticated } = useAuth()
  if (loading) return <PageLoader />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const guarded = (page) => <RouteErrorBoundary>{page}</RouteErrorBoundary>

export default function App() {
  return <RouteErrorBoundary><Suspense fallback={<PageLoader />}><AnimatePresence mode="wait"><Routes>
    <Route path="/" element={guarded(<Landing />)} />
    <Route path="/login" element={guarded(<AuthPage mode="login" />)} />
    <Route path="/register" element={guarded(<AuthPage mode="register" />)} />
    <Route path="/app" element={guarded(<Protected><AppLayout /></Protected>)}>
      <Route index element={guarded(<Dashboard />)} />
      <Route path="today" element={guarded(<TodayJournal />)} />
      <Route path="history" element={guarded(<History />)} />
      <Route path="calendar" element={guarded(<CalendarPage />)} />
      <Route path="entries/:id" element={guarded(<EntryDetail />)} />
      <Route path="insights" element={guarded(<Insights />)} />
      <Route path="settings" element={guarded(<Settings />)} />
    </Route>
    <Route path="*" element={guarded(<div className="page not-found"><span className="eyebrow">Page not found</span><h1>This page has wandered off.</h1><p>The address may have changed. Your journal is safe.</p><a className="button button-primary" href="/">Return home</a></div>)} />
  </Routes></AnimatePresence></Suspense></RouteErrorBoundary>
}
