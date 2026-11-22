import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookHeart, CalendarDays, ChartNoAxesCombined, House, Library, LogOut, Menu, Moon, PenLine, Settings, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useJournal } from '../../context/JournalContext'
import { ErrorState } from '../ui/States'
const nav = [
  { to: '/app', label: 'Sanctuary', icon: House, end: true }, { to: '/app/today', label: "Today's journal", icon: PenLine },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays }, { to: '/app/history', label: 'History', icon: Library },
  { to: '/app/insights', label: 'Insights', icon: ChartNoAxesCombined }, { to: '/app/settings', label: 'Settings', icon: Settings },
]
function Brand() { return <NavLink to="/app" className="brand"><span className="brand-mark"><BookHeart /></span><span><strong>{import.meta.env.VITE_APP_NAME || 'Daily Journal'}</strong><small>Your story, softly held.</small></span></NavLink> }
function SidebarContent({ close }) {
  const { user, logout } = useAuth()
  return <><Brand /><nav className="side-nav" aria-label="Primary navigation">{nav.map(({ to, label, icon: Icon, end }) => <NavLink key={to} end={end} to={to} onClick={close}><Icon /><span>{label}</span></NavLink>)}</nav><div className="side-profile"><div className="avatar">{(user?.firstName || user?.username || 'J')[0].toUpperCase()}</div><div><strong>{user?.firstName || user?.username}</strong><small>Private journal</small></div><button onClick={logout} className="icon-button" aria-label="Log out"><LogOut /></button></div></>
}
export default function AppLayout() {
  const [menu, setMenu] = useState(false); const { theme, toggleTheme } = useTheme(); const { error, loading, refresh } = useJournal(); const location = useLocation()
  return <div className="app-shell"><aside className="sidebar"><SidebarContent /></aside><header className="mobile-header"><Brand /><div><button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun /> : <Moon />}</button><button className="icon-button" onClick={() => setMenu(true)} aria-label="Open menu"><Menu /></button></div></header><AnimatePresence>{menu && <motion.div className="mobile-menu-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)}><motion.aside className="mobile-menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} onClick={(e) => e.stopPropagation()}><button className="icon-button menu-close" onClick={() => setMenu(false)} aria-label="Close menu"><X /></button><SidebarContent close={() => setMenu(false)} /></motion.aside></motion.div>}</AnimatePresence><main className="main-content"><div className="desktop-utility"><span>{location.pathname.includes('today') ? 'Reflection space' : 'Your private sanctuary'}</span><button className="theme-toggle" onClick={toggleTheme}>{theme === 'dark' ? <><Sun /> Light</> : <><Moon /> Night</>}</button></div>{loading && <p className="data-loading" role="status">Gathering your reflections…</p>}{error && <ErrorState message="Your reflections could not be loaded. Check your connection and try again." retry={refresh} />}<Outlet /></main><nav className="bottom-nav" aria-label="Mobile navigation">{nav.slice(0, 4).filter((_, i) => i !== 3).concat(nav[4]).map(({ to, label, icon: Icon, end }) => <NavLink key={to} end={end} to={to}><Icon /><span>{label === "Today's journal" ? 'Journal' : label}</span></NavLink>)}</nav></div>
}
