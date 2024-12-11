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
  const { floorPrice, tick, volume24h, rank } = token
  const { settings } = useSettings()

  const krc20TokenQuery = useQuery({
    queryKey: ['krc20TokenInfo', { selectedNode: settings.selectedNode, ticker: token.tick }],
    queryFn: krc20TokenInfoqueryFn,
  })

  const krc20Token = krc20TokenQuery.data

  const formattedTokenPrice = tokenPriceFormatter(floorPrice)

  const mintedPercentage =
    krc20Token?.minted && krc20Token?.max
      ? getMintedPercentage(formatValue(krc20Token.minted), formatValue(krc20Token.max))
      : '0'
  const preMintedPercentage =
    krc20Token?.pre && krc20Token?.max
      ? getMintedPercentage(formatValue(krc20Token.pre), formatValue(krc20Token.max))
      : '0'

  const numericalBalance = formatNumberWithDecimal(token.balance, token.dec)
  const currencyValue = numericalBalance * (token.floorPrice ?? 0)
  const formattedCurrencyValue = formatNumberAbbreviated(currencyValue, true)

  return (
    <div className="p-4">
      <TableSection
        title="Your Balance"
        rows={[
          { label: settings.currency, value: `${formattedCurrencyValue}` },
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
          ...(krc20Token
            ? [
                {
                  label: `Market cap`,
                  value: `${formatMarketCapAbbreviated(krc20Token.minted, krc20Token.dec, floorPrice)}`,
                },
                {
                  label: `Volume 24h`,
                  value: `${formatVolumeAbbreviated(volume24h)}`,
                },
                {
                  label: '',
                  value: (
                    <a
                      href={getKasFyiTokenUrl(krc20Token.tick)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View on Kas.Fyi
                    </a>
                  ),
                  isFullWidth: true,
                },
              ]
            : []),
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
                value: krc20Token.mintTotal.toLocaleString() || '0',
              },
              {
                label: 'Holders',
                value: krc20Token.holderTotal.toLocaleString() || '0',
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
