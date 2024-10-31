import React, { forwardRef } from 'react'
import CryptoImage from '@/components/CryptoImage'
import TransactionIcon from '@/pages/Wallet/Transactions/TransactionIcon'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import { KaspaTransaction } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import { formatNumberWithDecimal } from '@/utils/formatting'

interface KaspaTxnItemProps {
  transaction: KaspaTransaction
  isLast: boolean
  ref?: React.Ref<HTMLLIElement>
}

const KaspaTxnItem = forwardRef<HTMLLIElement, KaspaTxnItemProps>(({ transaction }, ref) => {
  const { kaspa } = useKaspa()
  const address = kaspa.addresses[0]
  const { transaction_id, outputs } = transaction
  const isReceived = outputs[0].script_public_key_address === address
  const amount = formatNumberWithDecimal(outputs[0].amount, 8)

  return (
    <li ref={ref} className="flex items-center justify-between p-4 bg-darkmuted rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="relative">
          <CryptoImage ticker={'KAS'} size="small" />
          <div className="absolute -bottom-1 -right-1">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border border-darkmuted">
              <TransactionIcon operationType={isReceived ? 'Received' : 'Sent'} />
            </div>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-base text-mutedtext">{isReceived ? 'Received' : 'Sent'}</p>
          <a
            href={`https://explorer.kaspa.org/txs/${transaction_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline mt-1 block"
          >
            View Transaction
          </a>
        </div>
      </div>
      <div className="text-right">
        <TransactionAmountDisplay
          amt={amount.toString()}
          tick={'KAS'}
          isMint={false}
          isReceived={isReceived}
        />
      </div>
    </li>
  )
})

export default KaspaTxnItem
