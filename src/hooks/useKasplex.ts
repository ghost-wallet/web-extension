import { useContext } from 'react'
import { KasplexContext } from '@/contexts/kasplex/KasplexContext'

export default function useKasplex() {
  const context = useContext(KasplexContext)

  if (!context) {
    throw new Error('useKasplex must be used within a KasplexProvider')
  }

  return context
}
