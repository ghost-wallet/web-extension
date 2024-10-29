import { KRC20Transaction } from '@/utils/interfaces'

interface OperationDetails {
  operationType: 'Sent' | 'Received' | 'Minted'
  isSent: boolean
  isReceived: boolean
  isMint: boolean
}

export function getOperationDetails(operation: KRC20Transaction, address: string): OperationDetails {
  const { op, to } = operation
  const isSent = op === 'transfer' && to !== address
  const isReceived = op === 'transfer' && to === address
  const isMint = op === 'mint'
  const operationType = isMint ? 'Minted' : isSent ? 'Sent' : 'Received'

  return { operationType, isSent, isReceived, isMint }
}
