import { BookOpen, RefreshCw } from 'lucide-react'
import { Button } from './Button'
export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} />
export function PageLoader() { return <div className="page-loader"><span className="loader-mark"><BookOpen /></span><p>Opening your journal…</p></div> }
export function EmptyState({ title, text, action, actionLabel }) { return <div className="empty-state"><span><BookOpen /></span><h3>{title}</h3><p>{text}</p>{action && <Button onClick={action}>{actionLabel}</Button>}</div> }
export function ErrorState({ message, retry }) { return <div className="error-state"><p>{message}</p>{retry && <Button variant="secondary" onClick={retry}><RefreshCw /> Try again</Button>}</div> }
