import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import TableSection from '@/components/table/TableSection'
import {
  formatNumberWithDecimal,
  formatNumberAbbreviated,
  tokenPriceFormatter,
  formatMarketCapAbbreviated,
  formatPercentage,
} from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { KRC20TokenResponse } from '@/types/interfaces'
import TokenPrice from '@/components/TokenPrice'

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

  const formattedTokenPrice = tokenPriceFormatter(token.floorPrice ?? 0)
  const formattedMarketCap = formatMarketCapAbbreviated(token.minted, token.dec, token.floorPrice ?? 0)

  return (
    <div className="rounded-md py-2">
      <div className="flex flex-row items-start justify-between py-1 pb-32">
        {/* Left Column */}
        <div className="flex flex-col items-center flex-shrink-0 min-w-[75px]">
          <CryptoImage ticker={token.tick} size="large" />
          <h1 className="text-primarytext font-bold text-xl pt-2">{token.tick}</h1>
        </div>

        {/* Right Column */}
        <div className="flex-grow ml-4">
          <TableSection
            rows={[
              {
                label: 'Price',
                value: <TokenPrice value={`${formattedTokenPrice}`} />,
              },
              {
                label: 'Market cap',
                value: `${formattedMarketCap}`,
              },
              {
                label: 'Total supply',
                value: formatNumberAbbreviated(formatNumberWithDecimal(token.max, token.dec)),
              },
              {
                label: 'Total minted',
                value: formatPercentage(mintedPercentage),
              },
              {
                label: 'Pre-minted',
                value: formatPercentage(preMintedPercentage),
              },
              {
                label: 'Mints',
                value: Number(token.mintTotal || 0).toLocaleString(navigator.language),
              },
              {
                label: 'Holders',
                value: Number(token.holderTotal || 0).toLocaleString(navigator.language),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default TokenDetails
