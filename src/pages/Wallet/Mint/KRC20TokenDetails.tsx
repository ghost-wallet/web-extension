import React from 'react'
import CryptoImage from '@/components/cryptos/CryptoImage'
import TableSection from '@/components/table/TableSection'
import { formatSupplyWithAbbreviation } from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { formatValue } from '@/utils/formatting'
import { KRC20TokenResponse } from '@/utils/interfaces'

interface KRC20TokenDetailsProps {
  token: KRC20TokenResponse
}

const KRC20TokenDetails: React.FC<KRC20TokenDetailsProps> = ({ token }) => {
  const mintedPercentage =
    !isNaN(token.minted) && !isNaN(token.max) && token.max > 0
      ? getMintedPercentage(token.minted, token.max)
      : '0'
  const preMintedPercentage =
    !isNaN(token.pre) && !isNaN(token.max) && token.max > 0 ? getMintedPercentage(token.pre, token.max) : '0'

  return (
    <div className="rounded-md pb-2">
      <div className="flex flex-row items-center justify-center pb-1 -mt-3">
        <CryptoImage ticker={token.tick} size="large" />
        <h1 className="text-primarytext font-lato font-bold text-4xl pl-4">{token.tick}</h1>
      </div>

      <TableSection
        rows={[
          {
            label: 'Total supply',
            value: formatSupplyWithAbbreviation(Number(formatValue(token.max)), token.dec),
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
            value: formatValue(token.mintTotal) || 'N/A',
          },
          {
            label: 'Holders',
            value: formatValue(token.holderTotal) || 'N/A',
          },
        ]}
      />
    </div>
  )
}

export default KRC20TokenDetails
