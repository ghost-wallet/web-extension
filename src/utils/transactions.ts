import { KRC20Transaction } from '@/utils/interfaces'
import useSettings from '@/hooks/contexts/useSettings'
import { chaingeMinterAddresses } from '@/utils/constants/constants'

interface OperationDetails {
  // TODO handle deploy op
  operationType: 'Sent' | 'Received' | 'Minted' | 'Swapped' | 'Unknown'
  isSent: boolean
  isReceived: boolean
  isSwappedTo: boolean
  isSwappedFrom: boolean
  isMint: boolean
}

export function getOperationDetails(operation: KRC20Transaction, address: string): OperationDetails {
  const { op, to, from } = operation
  const isSent = op === 'transfer' && to !== address
  const isReceived = op === 'transfer' && to === address
  const isSwappedTo = op === 'transfer' && Object.values(chaingeMinterAddresses).includes(to)
  const isSwappedFrom = op === 'transfer' && Object.values(chaingeMinterAddresses).includes(from)
  const isMint = op === 'mint'
  const operationType =
    isSwappedTo || isSwappedFrom
      ? 'Swapped'
      : isMint
        ? 'Minted'
        : isSent
          ? 'Sent'
          : isReceived
            ? 'Received'
            : 'Unknown'

  return { operationType, isSent, isReceived, isSwappedTo, isSwappedFrom, isMint }
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

export const getKasFyiTokenUrl = (tick: string) => {
  return `https://kas.fyi/token/krc20/${tick}`
}

export const getTransactionStatusText = (operationType: string, opAccept: string, op: string): string => {
  return opAccept === '1' ? operationType : `${op.charAt(0).toUpperCase() + op.slice(1)} Failed`
}
