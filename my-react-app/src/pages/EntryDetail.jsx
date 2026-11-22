import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Pencil, Trash2 } from 'lucide-react'
import { format, isValid, parseISO } from 'date-fns'
import { useJournal } from '../context/JournalContext'
import { moodMeta } from '../utils/moodUtils'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
const SECTIONS = [['went_well','What went well'],['best_moment','The best moment'],['learned_today','What I learned'],['went_bad','What felt difficult'],['improve_tomorrow','A thought for tomorrow']]
export default function EntryDetail() {
  const { id } = useParams(); const { entries, remove } = useJournal(); const navigate = useNavigate(); const toast = useToast(); const [confirm, setConfirm] = useState(false)
  const entry = entries.find((e) => String(e.id) === id)
  if (!entry) return <div className="page"><EmptyState title="This page is quiet" text="We couldn't find that reflection. It may have been removed." action={() => navigate('/app/history')} actionLabel="Back to history" /></div>
  const parsedDate = parseISO(entry.date || '')
  if (!isValid(parsedDate)) return <div className="page"><EmptyState title="This date is unclear" text="We couldn't read the date attached to this reflection." action={() => navigate('/app/history')} actionLabel="Back to history" /></div>
  const mood = moodMeta(entry.mood); const MoodIcon = mood.Icon; const del = async () => { try { await remove(entry.id); toast('The reflection has been removed.'); navigate('/app/history') } catch { toast('The reflection could not be deleted. Please try again.', 'error') } }
  return <div className="page reading-page"><Link to="/app/history" className="back-link"><ArrowLeft /> Back to history</Link><article className="entry-sheet"><header><span className="entry-date">{format(parseISO(entry.date), 'EEEE')}<strong>{format(parseISO(entry.date), 'MMMM d, yyyy')}</strong></span><div className="entry-mood" style={{ '--mood': mood.color }}><MoodIcon /><span><small>The day felt</small><strong>{mood.label}</strong></span></div><h1>A day in your <em>story.</em></h1></header><div className="entry-sections">{SECTIONS.map(([key, title], i) => <section key={key} className={!entry[key] ? 'empty' : ''}><span>{String(i + 1).padStart(2, '0')}</span><div><h2>{title}</h2>{entry[key] ? <p>{entry[key]}</p> : <p className="empty-copy">No words were needed here.</p>}</div></section>)}</div><footer><BookOpen /><p>Remembered on {format(parseISO(entry.date), 'MMMM d, yyyy')}</p></footer></article><div className="entry-actions"><Button variant="secondary" onClick={() => navigate(entry.date === new Date().toLocaleDateString('en-CA') ? '/app/today' : `/app/today?date=${entry.date}`)}><Pencil /> Edit reflection</Button><Button variant="ghost" onClick={() => setConfirm(true)}><Trash2 /> Delete</Button></div><Modal open={confirm} onClose={() => setConfirm(false)} onConfirm={del} title="Let this reflection go?" confirmLabel="Delete reflection" danger><p>This will permanently remove this day from your journal. This action cannot be undone.</p></Modal></div>
}
