import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import RecipientAddress from '@/components/RecipientAddress'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'
import AnimatedNetworkFee from '@/pages/Wallet/Send/AnimatedNetworkFee'
import TableSection from '@/components/table/TableSection'
import NextButton from '@/components/buttons/NextButton'

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
  error,
}) => {
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
      label: 'Network fee',
      value: <AnimatedNetworkFee fee={fee} />,
    },
  ]

  return (
    <>
      <Header title="Confirm Send" showBackButton={true} />

      <CryptoImage ticker={token.tick} size={'large'} />
      <div className="text-primarytext text-center p-2">
        <p className="text-lg">
          {amount} {token.tick}
        </p>
      </div>

      <div className="p-4">
        <TableSection rows={tableRows} className="mb-4" />

        <ErrorMessage message={error || ''} />

        <div className="flex pt-12 pb-20">
          <NextButton onClick={onConfirm} text={'Confirm Send'} />
        </div>
      </div>
    </>
  )
}

export default React.memo(ConfirmSendDetails)
