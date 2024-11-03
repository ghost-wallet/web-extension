import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import TableSection from '@/components/table/TableSection'
import { formatNumberWithDecimal, formatNumberWithAbbreviation } from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { KRC20TokenResponse } from '@/utils/interfaces'

interface KRC20TokenDetailsProps {
  token: KRC20TokenResponse
}

const TokenDetails: React.FC<KRC20TokenDetailsProps> = ({ token }) => {
  const mintedPercentage =
    !isNaN(token.minted) && !isNaN(token.max) && token.max > 0
      ? getMintedPercentage(token.minted, token.max)
      : '0'
  const preMintedPercentage =
    !isNaN(token.pre) && !isNaN(token.max) && token.max > 0 ? getMintedPercentage(token.pre, token.max) : '0'

  return (
    <div className="rounded-md py-2">
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex flex-col items-center">
          <CryptoImage ticker={token.tick} size="large" />
          <h1 className="text-primarytext font-bold text-xl pt-2">{token.tick}</h1>
        </div>

        <div className="flex-grow ml-4">
          <TableSection
            rows={[
              {
                label: 'Total supply',
                value: formatNumberWithAbbreviation(formatNumberWithDecimal(token.max, token.dec)),
              },
              {
                label: 'Total minted',
                value: `${mintedPercentage}%`,
              },
              {
                label: 'Pre-minted',
                value: `${preMintedPercentage}%`,
              },
              {
                label: 'Mints',
                value: token.mintTotal.toLocaleString() || '0',
              },
              {
                label: 'Holders',
                value: token.holderTotal.toLocaleString() || '0',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default TokenDetails
