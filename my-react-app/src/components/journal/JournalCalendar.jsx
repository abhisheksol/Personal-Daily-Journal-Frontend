import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, parseISO, startOfMonth, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { moodMeta } from '../../utils/moodUtils'
export default function JournalCalendar({ entries, compact = false }) {
  const [month, setMonth] = useState(new Date()); const navigate = useNavigate()
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const byDate = new Map(entries.map((e) => [e.date, e])); const offset = getDay(startOfMonth(month))
  return <div className={`calendar-panel ${compact ? 'compact' : ''}`}><div className="calendar-head"><div><small>{compact ? 'This month' : 'Your reflection rhythm'}</small><h2>{format(month, 'MMMM yyyy')}</h2></div><div><button className="icon-button" onClick={() => setMonth(subMonths(month, 1))} aria-label="Previous month"><ChevronLeft /></button><button className="icon-button" onClick={() => setMonth(addMonths(month, 1))} aria-label="Next month"><ChevronRight /></button></div></div><div className="calendar-weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => <span key={d}>{compact ? d[0] : d}</span>)}</div><div className="calendar-grid">{Array.from({ length: offset }, (_, i) => <span key={`x${i}`} />)}{days.map((day) => { const key = format(day, 'yyyy-MM-dd'); const entry = byDate.get(key); const mood = entry && moodMeta(entry.mood); return <button key={key} className={`${entry ? 'has-entry' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`} onClick={() => entry && navigate(`/app/entries/${entry.id}`)} disabled={!entry} aria-label={`${format(day, 'MMMM d')}${entry ? `, ${entry.mood} mood` : ', no entry'}`} style={mood ? { '--mood': mood.color } : {}}><span>{format(day, 'd')}</span>{entry && <i />}</button> })}</div></div>
}
