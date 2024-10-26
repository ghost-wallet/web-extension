import React, { useEffect, useState } from 'react'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import useSettings from '@/hooks/contexts/useSettings'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { getCurrencySymbol } from '@/utils/currencies'
import { formatTokenPrice, formatSupplyWithAbbreviation } from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { formatValue } from '@/utils/formatting'
import { calculateTotalValue } from '@/utils/calculations'
import TableSection from '@/components/table/TableSection'
import Spinner from '@/components/Spinner'

interface CryptoDetailsTableProps {
  token: {
    tick: string
    balance: number
    floorPrice: number
    dec: number
  }
}

const CryptoDetails: React.FC<CryptoDetailsTableProps> = ({ token }) => {
  const { floorPrice, tick } = token
  const { settings } = useSettings()
  const price = useKaspaPrice(settings.currency)
  const currencySymbol = getCurrencySymbol(settings.currency)

  const [krc20Token, setKrc20Token] = useState<any>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (tick !== 'KASPA') {
      const fetchTokenInfo = async () => {
        try {
          const tokenInfo = await fetchKrc20TokenInfo(0, tick)
          if (tokenInfo) {
            setKrc20Token(tokenInfo)
          }
        } catch (error) {
          console.error('Error fetching KRC20 token info:', error)
        }
      }

      fetchTokenInfo()
    }
  }, [tick])

  const tokenPrice = floorPrice * price
  const formattedTokenPrice = formatTokenPrice(tokenPrice)

  const mintedPercentage = isNaN(parseFloat(getMintedPercentage(krc20Token?.minted, krc20Token?.max)))
    ? '0'
    : getMintedPercentage(krc20Token.minted, krc20Token.max)
  const preMintedPercentage = isNaN(parseFloat(getMintedPercentage(krc20Token?.pre, krc20Token?.max)))
    ? '0'
    : getMintedPercentage(krc20Token.pre, krc20Token.max)

  const totalValue = calculateTotalValue(token.balance, floorPrice, tick, token.dec)

  return (
    <div className="p-4">
      <TableSection
        title="Your Balance"
        rows={[
          { label: settings.currency, value: `${currencySymbol}${totalValue}` },
          {
            label: tick,
            value: tick === 'KASPA' ? token.balance : formatValue(token.balance),
          },
        ]}
      />

      <TableSection
        title="Market Details"
        rows={[
          {
            label: `${settings.currency} Price`,
            value: `${currencySymbol}${tick === 'KASPA' ? price : formattedTokenPrice}`,
          },
        ]}
        className="mt-6 mb-2"
      />

      {tick !== 'KASPA' &&
        (krc20Token ? (
          <TableSection
            title="Token Details"
            rows={[
              {
                label: 'Max Supply',
                value: formatSupplyWithAbbreviation(Number(formatValue(krc20Token.max)), token.dec),
              },
              { label: 'Minted', value: mintedPercentage === '0' ? '0%' : `${mintedPercentage}%` },
              { label: 'Pre-minted', value: preMintedPercentage === '0' ? '0%' : `${preMintedPercentage}%` },
              { label: 'Total mints', value: formatValue(krc20Token.mintTotal) || 'N/A' },
              { label: 'Holders', value: formatValue(krc20Token.holderTotal) || 'N/A' },
            ]}
            className="mt-6 mb-16"
          />
        ) : (
          <Spinner />
        ))}
    </div>
  )
}

export default CryptoDetails
