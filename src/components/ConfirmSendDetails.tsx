import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import RecipientAddress from '@/components/RecipientAddress'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'
import KRC20NetworkFee from '@/pages/Wallet/Send/KRC20NetworkFee'
import TableSection from '@/components/table/TableSection'

interface ConfirmSendDetailsProps {
  token: any
  recipient: string
  amount: string | number
  fee: string | number
  network: string
  onConfirm: () => void
  loading: boolean
  error?: string
}

const ConfirmSendDetails: React.FC<ConfirmSendDetailsProps> = ({
  token,
  recipient,
  amount,
  fee,
  network,
  onConfirm,
  loading,
  error,
}) => {
  // Create rows for the TableSection
  const tableRows = [
    {
      label: 'To',
      // TODO: why is Recipient Address centered on the table?
      value: <RecipientAddress address={recipient} />,
    },
    {
      label: 'Network',
      value: network,
    },
    {
      label: 'Fee',
      value: <KRC20NetworkFee fee={fee} />,
    },
  ]

  return (
    <>
      <Header title="Confirm Send" showBackButton={true} />

      <CryptoImage ticker={token.tick} size={'large'} />
      <div className="text-primarytext text-center p-2">
        <p className="text-lg font-lato">
          {amount} {token.tick}
        </p>
      </div>

      <div className="p-4">
        <TableSection rows={tableRows} className="mb-4" />

        <ErrorMessage message={error || ''} />

        <div className="flex mt-6">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-secondarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6 hover:bg-secondary"
          >
            {loading ? 'Processing...' : 'Confirm Send'}
          </button>
        </div>
      </div>
    </>
  )
}

export default React.memo(ConfirmSendDetails)
