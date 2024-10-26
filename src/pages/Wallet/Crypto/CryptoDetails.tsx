import React, { useEffect, useState } from 'react'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import useSettings from '@/hooks/contexts/useSettings'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { getCurrencySymbol } from '@/utils/currencies'
import { formatTokenPrice, formatBalance, formatSupplyWithAbbreviation } from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import SpinnerPage from '@/components/SpinnerPage'

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

  const formatValue = (value: string | number | null | undefined) => {
    if (value === '0' || value === 0 || value === null || value === undefined) {
      return '0'
    }
    return value.toString()
  }

  const totalValue = (
    tick === 'KASPA'
      ? token.balance * (token.floorPrice ?? 0)
      : parseFloat(String(formatBalance(token.balance.toString(), token.dec))) * (token.floorPrice ?? 0)
  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="p-4">
      {/* Your Balance Section */}
      <h1 className="text-lg font-lato text-primarytext mb-2">Your Balance</h1>
      <div className="bg-bgdarker rounded-md py-1 px-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-base font-lato text-mutedtext py-2">{settings.currency}</td>
              <td className="text-base font-lato text-primarytext py-2 text-right">
                {currencySymbol}
                {totalValue}
              </td>
            </tr>
            <tr>
              <td className="text-base font-lato text-mutedtext py-2">{tick}</td>
              <td className="text-base font-lato text-primarytext py-2 text-right">
                {tick === 'KASPA'
                  ? token.balance
                  : formatBalance(token.balance.toString(), token.dec).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Market Details Section */}
      <h1 className="text-lg font-lato text-primarytext mt-6 mb-2">Market Details</h1>
      <div className="bg-bgdarker rounded-md py-1 px-4 mb-2">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-base font-lato text-mutedtext py-2">{settings.currency} Price</td>
              <td className="text-base font-lato text-primarytext py-2 text-right">
                {currencySymbol}
                {tick === 'KASPA' ? price : formattedTokenPrice}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Token Details Section */}
      {tick !== 'KASPA' ? (
        krc20Token ? (
          <>
            <h1 className="text-lg font-lato text-primarytext mt-6 mb-2">Token Details</h1>
            <div className="bg-bgdarker rounded-md py-1 px-4 mb-16">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-base font-lato text-mutedtext py-2">Max Supply</td>
                    <td className="text-base font-lato text-primarytext py-2 text-right">
                      {formatSupplyWithAbbreviation(Number(formatValue(krc20Token.max)), token.dec)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-lato text-mutedtext py-2">Minted</td>
                    <td className="text-base font-lato text-primarytext py-2 text-right">
                      {mintedPercentage === '0' ? '0%' : `${mintedPercentage}%`}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-lato text-mutedtext py-2">Pre-minted</td>
                    <td className="text-base font-lato text-primarytext py-2 text-right">
                      {preMintedPercentage === '0' ? '0%' : `${preMintedPercentage}%`}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-lato text-mutedtext py-2">Total mints</td>
                    <td className="text-base font-lato text-primarytext py-2 text-right">
                      {formatValue(krc20Token.mintTotal) || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-lato text-mutedtext py-2">Holders</td>
                    <td className="text-base font-lato text-primarytext py-2 text-right">
                      {formatValue(krc20Token.holderTotal) || 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <SpinnerPage displayText="Loading token details..." />
        )
      ) : null}
    </div>
  )
}

export default CryptoDetails
