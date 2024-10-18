import React from 'react'
import TokenDetails from '@/components/TokenDetails'
import RecipientAddress from '@/components/RecipientAddress'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'

interface ConfirmSendDetailsProps {
  token: any
  recipient: string
  amount: string | number
  fee: string | number
  network: string
  onConfirm: () => void
  onCancel: () => void
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
  onCancel,
  loading,
  error,
}) => {
  return (
    <>
      <Header title="Confirm Send" showBackButton={true} />

      <TokenDetails token={token} />
      <div className="text-primarytext text-center p-2">
        <p className="text-lg font-lato">
          {amount} {token.tick}
        </p>
      </div>

      <div className="p-6">
        <div className="bg-bgdarker rounded-md p-4">
          <div className="flex justify-between">
            <span className="text-base font-lato text-mutedtext">To</span>
            <RecipientAddress address={recipient} />
          </div>
        </div>

        <div className="bg-bgdarker rounded-md p-4">
          <div className="flex justify-between">
            <span className="text-base font-lato text-mutedtext">Network</span>
            <span className="text-base font-lato text-primarytext">{network}</span>
          </div>
        </div>

        <div className="bg-bgdarker rounded-md p-4">
          <div className="flex justify-between">
            <span className="text-base font-lato text-mutedtext">Network Fee</span>
            <span className="text-base font-lato text-primarytext">
              {fee} {token.tick === 'KASPA' ? 'KAS' : ''}
            </span>
          </div>
        </div>

        <ErrorMessage message={error || ''} />

        <div className="flex gap-[6px] mt-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-muted text-primarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6 hover:bg-slightmuted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-secondarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6 hover:bg-secondary"
          >
            {loading ? 'Processing...' : 'Send'}
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmSendDetails
