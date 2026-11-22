import { useCallback, useEffect, useMemo, useState } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { Clock3, Save, Sparkles } from 'lucide-react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import ReflectionField from '../components/journal/ReflectionField'
import MoodSelector from '../components/journal/MoodSelector'
import { Button } from '../components/ui/Button'
import { useJournal } from '../context/JournalContext'
import { localDateKey } from '../utils/journalUtils'
import { getApiError } from '../api/axiosClient'
import { useToast } from '../components/ui/Toast'

const FIELDS = [
  ['went_well', 'What went well today?', 'Celebrate your wins, no matter how small.', 'What made you feel proud today?'],
  ['best_moment', 'Best moment of the day', 'Remember something that made you smile.', 'What was the most beautiful moment of your day?'],
  ['learned_today', 'What did I learn today?', 'Capture knowledge, lessons, or new perspectives.', 'What is one thing you learned today?'],
  ['went_bad', 'What didn’t go well?', 'Reflect on challenges without judging yourself.', 'What was difficult today?'],
  ['improve_tomorrow', 'What could I improve tomorrow?', 'Choose one small action that can make tomorrow better.', 'What is one thing you want to do differently?'],
]
const blank = { went_well: '', best_moment: '', learned_today: '', went_bad: '', improve_tomorrow: '', mood: '' }
const entryToForm = (entry) => entry
  ? { ...blank, ...Object.fromEntries(Object.keys(blank).map((key) => [key, entry[key] || ''])) }
  : { ...blank }

export default function TodayJournal() {
  const { entries, save } = useJournal()
  const [params] = useSearchParams()
  const location = useLocation()
  const requestedDate = params.get('date')
  const parsedRequest = requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? parseISO(requestedDate) : null
  const dateKey = parsedRequest && isValid(parsedRequest) ? requestedDate : localDateKey()
  const displayDate = parseISO(dateKey)
  const isToday = dateKey === localDateKey()
  const existing = entries.find((entry) => entry.date === dateKey)
  const toast = useToast()
  const [form, setForm] = useState(blank)
  const [initial, setInitial] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [moodError, setMoodError] = useState('')

  useEffect(() => {
    const data = entryToForm(existing)
    setForm(data)
    setInitial(data)
  }, [existing, dateKey])

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial])
  const completed = FIELDS.filter(([key]) => form[key].trim()).length + (form.mood ? 1 : 0)
  const progress = Math.round((completed / 6) * 100)
  const changeField = useCallback((key, value) => setForm((current) => ({ ...current, [key]: value })), [])
  const fieldHandlers = useMemo(() => Object.fromEntries(FIELDS.map(([key]) => [key, (value) => changeField(key, value)])), [changeField])
  const changeMood = useCallback((mood) => {
    setForm((current) => ({ ...current, mood }))
    setMoodError('')
  }, [])

  useEffect(() => {
    const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }
    const confirmNavigation = (event) => {
      if (!dirty || !(event.target instanceof Element)) return
      const anchor = event.target.closest('a[href]')
      if (!anchor || anchor.target === '_blank') return
      const next = new URL(anchor.href, window.location.href)
      const routeChanges = next.origin !== window.location.origin || next.pathname !== location.pathname || next.search !== location.search
      if (routeChanges && !window.confirm('You have unsaved thoughts. Leave this reflection without saving?')) event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    document.addEventListener('click', confirmNavigation, true)
    return () => {
      window.removeEventListener('beforeunload', warn)
      document.removeEventListener('click', confirmNavigation, true)
    }
  }, [dirty, location.pathname, location.search])

  const submit = async (event) => {
    event.preventDefault()
    if (!form.mood) {
      setMoodError('Choose a mood for your day before saving.')
      return
    }
    setSaving(true)
    try {
      const saved = await save(existing, { ...form, date: dateKey })
      const data = entryToForm(saved)
      setForm(data)
      setInitial(data)
      toast('Another page of your story, safely kept.')
    } catch (error) {
      toast(getApiError(error, 'Your reflection could not be saved.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  return <div className="page journal-page">
    <header className="journal-header">
      <span className="eyebrow"><Sparkles /> {isToday ? 'Evening reflection' : 'A remembered day'}</span>
      <h1>{format(displayDate, 'EEEE, MMMM d')}</h1>
      <p className="journal-subtitle">A quiet moment to remember {isToday ? 'today' : 'this day'}.</p>
      <div className="journal-date-ornament"><i /><span>Your story, softly held</span><i /></div>
      <div><span><Clock3 /> 5–10 minutes</span></div>
    </header>
    <div className="progress-wrap" aria-label={`Reflection ${progress}% complete`}>
      <div><span>{progress === 100 ? 'Reflection complete' : 'Your reflection'}</span><strong>{progress}%</strong></div>
      <div className="progress-track"><motion.span animate={{ width: `${progress}%` }} /></div>
    </div>
    <form onSubmit={submit} className="journal-form">
      {FIELDS.map(([key, title, description, placeholder], index) => <ReflectionField key={key} index={index + 1} title={title} description={description} placeholder={placeholder} value={form[key]} onChange={fieldHandlers[key]} />)}
      <MoodSelector value={form.mood} onChange={changeMood} error={moodError} />
      <div className="save-panel"><div><Save /><span><strong>{existing ? 'Update this story' : 'Keep this day'}</strong><small>Your reflection stays private to you.</small></span></div><Button type="submit" loading={saving} disabled={!dirty && Boolean(existing)}>{saving ? 'Keeping your page…' : existing ? 'Save changes' : 'Save reflection'}</Button></div>
    </form>
  </div>
}
