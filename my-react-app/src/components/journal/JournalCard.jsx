import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'
import { moodMeta } from '../../utils/moodUtils'
import { entryPreview } from '../../utils/journalUtils'
export default function JournalCard({ entry }) {
  const mood = moodMeta(entry.mood); const Icon = mood.Icon
  return <article className="journal-card"><div className="journal-card-date"><span>{format(parseISO(entry.date), 'dd')}</span><small>{format(parseISO(entry.date), 'MMM yyyy')}</small></div><div className="journal-card-body"><div className="journal-card-meta" style={{ '--mood': mood.color }}><Icon /> {mood.label}</div><p>{entryPreview(entry)}</p></div><Link to={`/app/entries/${entry.id}`} className="round-link" aria-label={`Open entry from ${entry.date}`}><ArrowUpRight /></Link></article>
}
