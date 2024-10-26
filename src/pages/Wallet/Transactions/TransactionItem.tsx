import React, { forwardRef } from 'react'
import CryptoImage from '@/components/cryptos/CryptoImage'
import { PaperAirplaneIcon, ArrowDownIcon, BoltIcon } from '@heroicons/react/24/outline'
import useKaspa from '@/hooks/contexts/useKaspa'

interface TransactionItemProps {
  operation: any
  isLast: boolean
  ref?: React.Ref<HTMLLIElement>
}

const TransactionItem = forwardRef<HTMLLIElement, TransactionItemProps>(({ operation }, ref) => {
  const { kaspa } = useKaspa()
  const address = kaspa.addresses[0][0] // Your address

  const isReceived = operation.op === 'transfer' && operation.to === address
  const isMint = operation.op === 'mint' // Check if operation is 'mint'

  const operationType = isMint ? 'Mint' : isReceived ? 'Received' : 'Sent'
  const Icon = isMint ? BoltIcon : isReceived ? ArrowDownIcon : PaperAirplaneIcon

  return (
    <li ref={ref} className="flex items-center p-4 bg-darkmuted rounded-lg shadow-md">
      <div className="relative">
        <CryptoImage ticker={operation.tick} size="small" />
        <div className="absolute -bottom-1 -right-1">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border border-darkmuted">
            <Icon className="w-4 h-4 text-black" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="ml-4">
        <p className="text-base font-light font-lato text-primarytext">
          {operationType} {parseInt(operation.amt, 10) / 1e8} {operation.tick}
        </p>
        <a
          href={`https://explorer.kaspa.org/txs/${operation.hashRev}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-light font-lato text-base hover:underline"
        >
          View Transaction
        </a>
      </div>
    </li>
  )
})

export default TransactionItem
