import { MOODS } from '../../utils/moodUtils'
export default function MoodSelector({ value, onChange, error }) {
  return <fieldset className="mood-fieldset" aria-describedby={error ? 'mood-error' : undefined}><legend>How was your day overall?</legend><p>There is no wrong answer. Choose what feels true.</p><div className="mood-grid">{MOODS.map(({ value: mood, label, color, Icon }) => <button type="button" key={mood} onClick={() => onChange(mood)} className={`mood-option ${value === mood ? 'selected' : ''}`} style={{ '--mood': color }} aria-pressed={value === mood}><span><Icon /></span><strong>{label}</strong><small>{mood}</small></button>)}</div>{error && <span id="mood-error" className="field-error" role="alert">{error}</span>}</fieldset>
}
