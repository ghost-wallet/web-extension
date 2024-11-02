import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sortTokensByValue } from '@/utils/sorting'
import { useTotalValueCalculation } from '@/hooks/useTotalValueCalculation'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/contexts/useKaspa'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import { fetchKrc20Tokens } from '@/hooks/kasplex/fetchKrc20Tokens'
import { KaspaToken, Token, KsprToken } from '@/utils/interfaces'
import { useQuery } from '@tanstack/react-query'
import ErrorMessage from '@/components/ErrorMessage'
import { useKsprPrices } from '@/hooks/kspr/fetchKsprPrices'

interface CryptoListProps {
  onTotalValueChange: (value: number) => void
}

interface FetchKRC20TokensParams {
  selectedNode: number
  address: string
}

function krc20TokenqueryFn({ queryKey }: { queryKey: [string, FetchKRC20TokensParams] }) {
  const [_key, { selectedNode, address }] = queryKey
  return fetchKrc20Tokens(selectedNode, address)
}

const CryptoList: React.FC<CryptoListProps> = ({ onTotalValueChange }) => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch KRC20 tokens
  const krc20TokensQuery = useQuery({
    queryKey: ['krc20Tokens', { selectedNode: settings.selectedNode, address: kaspa.addresses[0] }],
    queryFn: krc20TokenqueryFn,
    staleTime: 3_000, // 3 seconds
    refetchInterval: 3_000,
  })

  const ksprPricesQuery = useKsprPrices()

  const isLoading = kaspaPrice.isPending || krc20TokensQuery.isLoading || ksprPricesQuery.isLoading
  const error = kaspaPrice.error || krc20TokensQuery.error || ksprPricesQuery.error
  const kasPrice = kaspaPrice.data ?? 0

  const kaspaCrypto: KaspaToken = useMemo(
    () => ({
      isKaspa: true,
      tick: 'KASPA',
      balance: kaspa.balance,
      dec: 8,
      floorPrice: kasPrice,
    }),
    [kaspa.balance, kasPrice],
  )

  // Merge KSPR token prices with KRC20 tokens
  const tokens = useMemo(() => {
    if (!krc20TokensQuery.data || !ksprPricesQuery.data) return null

    return [
      kaspaCrypto,
      ...krc20TokensQuery.data.map((token) => {
        const ksprPriceData: KsprToken | undefined = ksprPricesQuery.data[token.tick]
        const floorPrice = ksprPriceData?.floor_price ?? 0
        return {
          ...token,
          floorPrice: floorPrice * kasPrice,
        }
      }),
    ]
  }, [kaspaCrypto, krc20TokensQuery.data, ksprPricesQuery.data, kasPrice])

  useTotalValueCalculation(tokens || [], kaspaPrice.data!, onTotalValueChange)

  if (isLoading || !tokens) {
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const filteredCryptos = tokens.filter((token) => token.tick === 'KASPA' || token.balance !== '0')
  const sortedCryptos = sortTokensByValue(filteredCryptos)
  const currencySymbol = getCurrencySymbol(settings.currency)

  const handleTokenClick = (token: Token | KaspaToken) => {
    if (location.pathname.includes('/send')) {
      navigate(`/send/${token.tick}`, { state: { token } })
    } else if (location.pathname.includes('/wallet')) {
      navigate(`/wallet/${token.tick}`, { state: { token } })
    }
  }

  return (
    <div className="w-full p-4 mb-20 h-full overflow-auto">
      {sortedCryptos.length === 0 ? (
        <p className="text-base text-mutedtext">None</p>
      ) : (
        <ul className="space-y-3">
          {sortedCryptos.map((token) => (
            <li
              key={token.tick}
              onClick={() => handleTokenClick(token)}
              className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
            >
              <CryptoListItem token={token} currencySymbol={currencySymbol} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CryptoList
