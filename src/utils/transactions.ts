import { KRC20Transaction } from '@/utils/interfaces'
import useSettings from '@/hooks/contexts/useSettings'

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

export const getKaspaExplorerUrl = (transactionId: string) => {
  const { settings } = useSettings()
  const networkAddress = settings.nodes[settings.selectedNode].address

  let baseUrl = 'https://explorer.kaspa.org'

  if (networkAddress.includes('testnet-10')) {
    baseUrl = 'https://explorer-tn10.kaspa.org'
  } else if (networkAddress.includes('testnet-11')) {
    baseUrl = 'https://explorer-tn11.kaspa.org'
  }

  return `${baseUrl}/txs/${transactionId}`
}

export const getTransactionStatusText = (operationType: string, opAccept: string, op: string): string => {
  return opAccept === '1' ? operationType : `${op.charAt(0).toUpperCase() + op.slice(1)} Failed`
}
