import { differenceInCalendarDays, format, parseISO, startOfMonth } from 'date-fns'
export const localDateKey = (date = new Date()) => format(date, 'yyyy-MM-dd')
export const entryDate = (entry) => parseISO(entry.date)
export const entryPreview = (entry) => entry.best_moment || entry.went_well || entry.learned_today || entry.went_bad || entry.improve_tomorrow || 'A quiet reflection.'
export const sortEntries = (entries) => [...entries].sort((a, b) => b.date.localeCompare(a.date))
export const calculateStats = (entries) => {
  const unique = [...new Map(entries.map((e) => [e.date, e])).values()]
  const dates = unique.map(entryDate).sort((a, b) => b - a)
  let currentStreak = 0
  if (dates.length && differenceInCalendarDays(new Date(), dates[0]) <= 1) {
    currentStreak = 1
    for (let i = 1; i < dates.length && differenceInCalendarDays(dates[i - 1], dates[i]) === 1; i += 1) currentStreak += 1
  }
  let longestStreak = dates.length ? 1 : 0, run = dates.length ? 1 : 0
  for (let i = 1; i < dates.length; i += 1) {
    run = differenceInCalendarDays(dates[i - 1], dates[i]) === 1 ? run + 1 : 1
    longestStreak = Math.max(longestStreak, run)
  }
  const monthStart = localDateKey(startOfMonth(new Date()))
  const monthEntries = unique.filter((e) => e.date >= monthStart)
  const moods = monthEntries.reduce((a, e) => ({ ...a, [e.mood]: (a[e.mood] || 0) + 1 }), {})
  return { total: unique.length, currentStreak, longestStreak, monthCount: monthEntries.length, frequentMood: Object.entries(moods).sort((a, b) => b[1] - a[1])[0]?.[0] || '—' }
}
