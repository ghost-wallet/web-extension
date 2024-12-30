import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CryptoImage from '@/components/CryptoImage'
import TransactionIcon from '@/pages/Wallet/Transactions/TransactionIcon'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import { KaspaTransaction } from '@/types/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import { formatNumberWithDecimal } from '@/utils/formatting'
import { KAS_TICKER } from '@/utils/constants/tickers'

interface KaspaTxnItemProps {
  transaction: KaspaTransaction
  isLast: boolean
  ref?: React.Ref<HTMLLIElement>
}

const KaspaTxnItem = forwardRef<HTMLLIElement, KaspaTxnItemProps>(({ transaction }, ref) => {
  const { kaspa } = useKaspa()
  const navigate = useNavigate()
  const address = kaspa.addresses[0]
  const { outputs } = transaction

  const isReceived = outputs[0].script_public_key_address === address
  const amount = formatNumberWithDecimal(outputs[0].amount, 8)

  const handleClick = () => {
    navigate(`/transactions/kaspa/details`, {
      state: {
        isReceived,
        amount,
        transaction,
      },
    })
  }

  return (
    <li
      ref={ref}
      className="flex items-center justify-between p-4 bg-darkmuted hover:bg-slightmuted rounded-lg shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <CryptoImage ticker={KAS_TICKER} size="small" />
          <div className="absolute -bottom-1 -right-1">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border border-darkmuted">
              <TransactionIcon operationType={isReceived ? 'Received' : 'Sent'} />
            </div>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-base text-mutedtext">{isReceived ? 'Received' : 'Sent'}</p>
        </div>
      </div>
      <div className="text-right">
        <TransactionAmountDisplay
          amt={amount.toString()}
          tick={KAS_TICKER}
          isMint={false}
          isReceived={isReceived}
          className={'text-base'}
        />
      </div>
    </li>
  )
})

export default KaspaTxnItem
