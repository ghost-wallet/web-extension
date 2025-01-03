import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'
import Header from '@/components/Header'
import AnimatedNetworkFee from '@/pages/Wallet/Send/AnimatedNetworkFee'
import TableSection from '@/components/table/TableSection'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface ConfirmSendDetailsProps {
  token: any
  recipient: string
  amount: string | number
  fee: string | number
  network: string
  loading: boolean
}

const ConfirmSendDetails: React.FC<ConfirmSendDetailsProps> = ({
  token,
  recipient,
  amount,
  fee,
  network,
}) => {
  const tableRows = [
    {
      label: 'To',
      value: <TruncatedCopyAddress address={recipient} />,
    },
    {
      label: 'Network',
      value: network,
    },
    {
      label: 'Gas fee',
      value: <AnimatedNetworkFee fee={fee} />,
    },
  ]

  return (
    <>
      <Header title="Confirm Send" showBackButton={true} />
      <div className="flex flex-col items-center justify-center">
        <CryptoImage ticker={token.tick} size={'large'} />
        <div className="text-primarytext text-center p-2">
          <p className="text-lg">
            {formatNumberAbbreviated(Number(amount))} {token.tick}
          </p>
        </div>
      </div>
      <div className="px-4 pt-2">
        <TableSection rows={tableRows} />
      </div>
    </>
  )
}

export default React.memo(ConfirmSendDetails)
