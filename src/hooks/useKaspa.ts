import { useContext } from 'react'
import { KaspaContext } from '@/contexts/KaspaContext'

export default function useKaspa() {
  const context = useContext(KaspaContext)

  if (!context) throw new Error('Missing Kaspa context')

  return context
}
