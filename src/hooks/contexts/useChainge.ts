import { useContext } from 'react'
import { ChaingeContext } from '@/contexts/chainge/ChaingeContext'

export default function useChainge() {
  const context = useContext(ChaingeContext)

  if (!context) throw new Error('Missing Chainge context')

  return context
}
