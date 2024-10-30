import React, { useEffect, useState } from 'react'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import useSettings from '@/hooks/contexts/useSettings'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { getCurrencySymbol } from '@/utils/currencies'
import {
  formatNumberWithDecimal,
  formatNumberWithAbbreviation,
  tokenPriceFormatter,
} from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { formatValue } from '@/utils/formatting'
import { calculateTotalValue } from '@/utils/calculations'
import TableSection from '@/components/table/TableSection'
import Spinner from '@/components/Spinner'
import TokenPrice from '@/components/TokenPrice'
import { Token } from '@/utils/interfaces'
import { useQuery } from '@tanstack/react-query'

interface CryptoDetailsTableProps {
  token: Token
}

interface FetchKRC20TokenInfoParams {
  selectedNode: number
  ticker: string
}

function krc20TokenInfoqueryFn({ queryKey }: { queryKey: [string, FetchKRC20TokenInfoParams] }) {
  const [_key, { selectedNode, ticker }] = queryKey
  return fetchKrc20TokenInfo(selectedNode, ticker)
}

const KRC20Details: React.FC<CryptoDetailsTableProps> = ({ token }) => {
  const { floorPrice, tick } = token
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const currencySymbol = getCurrencySymbol(settings.currency)

  // const [krc20Token, setKrc20Token] = useState<any>(null)

  // useEffect(() => {
  //   window.scrollTo(0, 0)
  //   if (tick !== 'KASPA') {
  //     const fetchTokenInfo = async () => {
  //       try {
  //         const tokenInfo = await fetchKrc20TokenInfo(0, tick)
  //         if (tokenInfo) {
  //           setKrc20Token(tokenInfo)
  //         }
  //       } catch (error) {
  //         console.error('Error fetching KRC20 token info:', error)
  //       }
  //     }

  //     fetchTokenInfo()
  //   }
  // }, [tick])

  const krc20TokenQuery = useQuery({
    queryKey: ['krc20TokenInfo', { selectedNode: settings.selectedNode, ticker: token.tick}],
    queryFn: krc20TokenInfoqueryFn
  })

  const krc20Token = krc20TokenQuery.data

  const tokenPrice = floorPrice * kaspaPrice.data!
  const formattedTokenPrice = tokenPriceFormatter(tokenPrice)

  const mintedPercentage =
    krc20Token?.minted && krc20Token?.max
      ? getMintedPercentage(formatValue(krc20Token.minted), formatValue(krc20Token.max))
      : '0'
  const preMintedPercentage =
    krc20Token?.pre && krc20Token?.max
      ? getMintedPercentage(formatValue(krc20Token.pre), formatValue(krc20Token.max))
      : '0'

  const totalValue = calculateTotalValue(token.balance, floorPrice, tick, token.dec)

  return (
    <div className="p-4">
      <TableSection
        title="Your Balance"
        rows={[
          { label: settings.currency, value: `${currencySymbol}${totalValue}` },
          {
            label: tick,
            value: formatNumberWithDecimal(token.balance, token.dec).toLocaleString(),
          },
        ]}
      />

      <TableSection
        title="Market Details"
        rows={[
          {
            label: `${settings.currency} Price`,
            value: (
              <TokenPrice value={`${currencySymbol}${formattedTokenPrice}`} />
            ),
          },
        ]}
        className="mt-6 mb-2"
      />

      {krc20Token ? (
        <>
          <TableSection
            title="Token Details"
            rows={[
              {
                label: 'Total supply',
                value: formatNumberWithAbbreviation(formatNumberWithDecimal(krc20Token.max, krc20Token.dec)),
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
                value: krc20Token.mintTotal.toLocaleString() || '0',
              },
              {
                label: 'Holders',
                value: krc20Token.holderTotal.toLocaleString() || '0',
              },
            ]}
            className="mt-6 mb-16"
          />
            <TransactionsHistory tick={krc20Token.tick} />
        </>
        ) : (
          <Spinner />
        )}
    </div>
  )
}

export default KRC20Details
