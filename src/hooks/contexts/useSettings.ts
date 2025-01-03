import { useContext } from 'react'
import { SettingsContext } from '@/contexts/settings/SettingsContext'

export default function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) throw new Error('Missing Settings context')

  return context
}
