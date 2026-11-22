import { useJournal } from '../context/JournalContext'
import JournalCalendar from '../components/journal/JournalCalendar'
export default function CalendarPage() { const { entries } = useJournal(); return <div className="page"><header className="page-header"><span className="eyebrow">Days remembered</span><h1>Your life, <em>at a glance.</em></h1><p>Every marked day holds a story. Choose one to return to it.</p></header><JournalCalendar entries={entries} /></div> }
