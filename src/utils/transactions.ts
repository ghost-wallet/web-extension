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

const getKaspaExplorerBaseUrl = () => {
  const { settings } = useSettings()
  const networkAddress = settings.nodes[settings.selectedNode].address

  if (networkAddress.includes('testnet-10')) {
    return 'https://explorer-tn10.kaspa.org'
  } else if (networkAddress.includes('testnet-11')) {
    return 'https://explorer-tn11.kaspa.org'
  }
  return 'https://explorer.kaspa.org'
}

export const getKaspaExplorerTxsUrl = (transactionId: string) => {
  return `${getKaspaExplorerBaseUrl()}/txs/${transactionId}`
}

export const getKaspaExplorerAddressUrl = (address: string) => {
  return `${getKaspaExplorerBaseUrl()}/addresses/${address}`
}

export const getKasFyiTransactionUrl = (transactionId: string) => {
  return `https://kas.fyi/transaction/${transactionId}`
}

export const getTransactionStatusText = (operationType: string, opAccept: string, op: string): string => {
  return opAccept === '1' ? operationType : `${op.charAt(0).toUpperCase() + op.slice(1)} Failed`
}
