import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import JournalCard from '../components/journal/JournalCard'
import { EmptyState } from '../components/ui/States'
import { useJournal } from '../context/JournalContext'
import { entryPreview, sortEntries } from '../utils/journalUtils'
import { MOODS } from '../utils/moodUtils'
export default function History() {
  const { entries } = useJournal(); const navigate = useNavigate(); const [query, setQuery] = useState(''); const [mood, setMood] = useState('all'); const [month, setMonth] = useState('all'); const [shown, setShown] = useState(8)
  const months = [...new Set(entries.map((e) => e.date.slice(0, 7)))].sort().reverse()
  const filtered = useMemo(() => sortEntries(entries).filter((e) => (mood === 'all' || e.mood === mood) && (month === 'all' || e.date.startsWith(month)) && `${entryPreview(e)} ${e.went_well} ${e.learned_today}`.toLowerCase().includes(query.toLowerCase())), [entries, mood, month, query])
  return <div className="page"><header className="page-header"><span className="eyebrow">Your story so far</span><h1>Reflection <em>history.</em></h1><p>Return to the days, moments, and lessons that made you who you are.</p></header><section className="filter-bar"><label className="search-box"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your reflections…" /></label><div className="select-wrap"><SlidersHorizontal /><select value={mood} onChange={(e) => setMood(e.target.value)}><option value="all">Every mood</option>{MOODS.map((m) => <option key={m.value}>{m.value}</option>)}</select></div><div className="select-wrap"><select value={month} onChange={(e) => setMonth(e.target.value)}><option value="all">All months</option>{months.map((m) => <option value={m} key={m}>{new Date(`${m}-02`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</option>)}</select></div></section><div className="history-count"><span>{filtered.length} {filtered.length === 1 ? 'reflection' : 'reflections'}</span><i /></div><section className="history-list">{filtered.slice(0, shown).map((e) => <JournalCard entry={e} key={e.id} />)}{!filtered.length && <EmptyState title="A quiet page" text={entries.length ? 'No reflections match those filters. Try another search.' : 'Your past reflections will gather here, one day at a time.'} action={!entries.length ? () => navigate('/app/today') : null} actionLabel="Write today’s reflection" />}</section>{shown < filtered.length && <button className="button button-secondary load-more" onClick={() => setShown((n) => n + 8)}>Show more reflections</button>}</div>
}
