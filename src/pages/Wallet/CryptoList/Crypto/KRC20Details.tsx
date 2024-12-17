import React from 'react'
import useSettings from '@/hooks/contexts/useSettings'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import {
  formatNumberWithDecimal,
  formatNumberAbbreviated,
  tokenPriceFormatter,
  formatMarketCapAbbreviated,
  formatVolumeAbbreviated,
} from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { formatValue } from '@/utils/formatting'
import TableSection from '@/components/table/TableSection'
import Spinner from '@/components/loaders/Spinner'
import TokenPrice from '@/components/TokenPrice'
import { Token } from '@/utils/interfaces'
import { useQuery } from '@tanstack/react-query'
import KRC20TxnHistory from '../../Transactions/KRC20TxnHistory'
import { getKasFyiTokenUrl } from '@/utils/transactions'

export const NO_DATA_SYMBOL = '-'

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
  const { floorPrice, tick, volume24h, rank, balance, dec } = token
  const { settings } = useSettings()

  const krc20TokenQuery = useQuery({
    queryKey: ['krc20TokenInfo', { selectedNode: settings.selectedNode, ticker: token.tick }],
    queryFn: krc20TokenInfoqueryFn,
  })

  const krc20Token = krc20TokenQuery.data

  const formattedTokenPrice = floorPrice > 0 ? tokenPriceFormatter(floorPrice) : NO_DATA_SYMBOL

  const mintedPercentage =
    krc20Token?.minted && krc20Token?.max
      ? getMintedPercentage(formatValue(krc20Token.minted), formatValue(krc20Token.max))
      : '0'
  const preMintedPercentage =
    krc20Token?.pre && krc20Token?.max
      ? getMintedPercentage(formatValue(krc20Token.pre), formatValue(krc20Token.max))
      : '0'

  const numericalBalance = formatNumberWithDecimal(balance, dec)
  const currencyValue =
    floorPrice > 0 ? formatNumberAbbreviated(numericalBalance * floorPrice, true) : NO_DATA_SYMBOL

  const marketCap =
    krc20Token && floorPrice > 0
      ? formatMarketCapAbbreviated(krc20Token.minted, krc20Token.dec, floorPrice)
      : NO_DATA_SYMBOL
  const volume = volume24h > 0 ? formatVolumeAbbreviated(volume24h) : NO_DATA_SYMBOL

  return (
    <div className="p-4">
      <TableSection
        title="Your Balance"
        rows={[
          { label: settings.currency, value: `${currencyValue}` },
          {
            label: tick,
            value: formatNumberAbbreviated(formatNumberWithDecimal(token.balance, token.dec)),
          },
        ]}
      />

      <TableSection
        title="Market Details"
        rows={[
          {
            label: `KRC20 Rank`,
            value: <TokenPrice value={`${rank}`} />,
          },
          {
            label: `${settings.currency} Price`,
            value: <TokenPrice value={`${formattedTokenPrice}`} />,
          },
          {
            label: `Market cap`,
            value: `${marketCap}`,
          },
          {
            label: `Volume 24h`,
            value: `${volume}`,
          },
          {
            label: '',
            value: (
              <a
                href={getKasFyiTokenUrl(token.tick)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View on Kas.Fyi
              </a>
            ),
            isFullWidth: true,
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
                value: formatNumberAbbreviated(formatNumberWithDecimal(krc20Token.max, krc20Token.dec)),
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
                value: krc20Token.mintTotal.toLocaleString() || NO_DATA_SYMBOL,
              },
              {
                label: 'Holders',
                value: krc20Token.holderTotal.toLocaleString() || NO_DATA_SYMBOL,
              },
            ]}
            className="mt-6 mb-6"
          />
          <h1 className="text-primarytext text-2xl font-rubik text-center pb-2">Recent Activity</h1>
          <KRC20TxnHistory tick={krc20Token.tick} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

export default KRC20Details
