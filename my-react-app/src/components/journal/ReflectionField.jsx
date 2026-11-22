import { memo, useEffect, useRef, useState } from 'react'

const MILESTONES = [50, 100, 200]

function ReflectionField({ index, title, description, placeholder, value, onChange }) {
  const ref = useRef(null)
  const seen = useRef(new Set())
  const timer = useRef(null)
  const [milestone, setMilestone] = useState('')
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${Math.max(128, ref.current.scrollHeight)}px`
    }
  }, [value])
  useEffect(() => () => clearTimeout(timer.current), [])
  const handleChange = (next) => {
    onChange(next)
    const words = next.trim() ? next.trim().split(/\s+/).length : 0
    const reached = MILESTONES.find((count) => words >= count && !seen.current.has(count))
    if (reached) {
      seen.current.add(reached)
      setMilestone(reached === 50 ? 'Your thoughts are finding their place.' : reached === 100 ? 'Another little piece of your story.' : 'Beautifully captured.')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setMilestone(''), 2600)
    }
  }
  return <section className="reflection-field"><div className="reflection-number">{String(index).padStart(2, '0')}</div><div className="reflection-copy"><label htmlFor={`field-${index}`}>{title}</label><p>{description}</p><textarea ref={ref} id={`field-${index}`} value={value} onChange={(e) => handleChange(e.target.value)} placeholder={placeholder} rows="4" aria-describedby={`field-help-${index}`} /><small id={`field-help-${index}`}>{milestone ? <span className="writing-milestone" role="status">{milestone}</span> : value.length ? `${value.length} characters` : 'Write as much or as little as you need.'}</small></div></section>
}

export default memo(ReflectionField)
