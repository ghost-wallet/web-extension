import React from 'react'
import TokenDetails from '@/components/TokenDetails'
import RecipientAddress from '@/components/RecipientAddress'
import BackButton from '@/components/BackButton'

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
      <div className="flex items-center justify-between mb-4 p-6">
        <BackButton />
        <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">Confirm Send</h1>
        <div className="w-6" />
      </div>

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

        {error && <div className="text-error mt-2">{error}</div>}

        <div className="flex gap-[6px] mt-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-muted text-primarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-secondarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6"
          >
            {loading ? 'Processing...' : 'Send'}
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmSendDetails
