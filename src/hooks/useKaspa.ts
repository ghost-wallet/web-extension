import { useContext } from 'react'
import { KaspaContext } from '../contexts/Kaspa'

export default function useKaspa() {
  const context = useContext(KaspaContext)
  console.log('useKaspa context', context)

  if (!context) throw new Error('Missing Kaspa context')

  return context
}
