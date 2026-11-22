import { CloudRain, CloudSun, Sun, Sparkles } from 'lucide-react'
export const MOODS = [
  { value: 'Bad', label: 'Heavy', color: '#8da0c2', Icon: CloudRain },
  { value: 'Okay', label: 'Steady', color: '#c4aa83', Icon: CloudSun },
  { value: 'Good', label: 'Good', color: '#8bc9ae', Icon: Sun },
  { value: 'Great', label: 'Radiant', color: '#a5a0e8', Icon: Sparkles },
]
export const moodMeta = (value) => MOODS.find((m) => m.value.toLowerCase() === String(value).toLowerCase()) || MOODS[1]
