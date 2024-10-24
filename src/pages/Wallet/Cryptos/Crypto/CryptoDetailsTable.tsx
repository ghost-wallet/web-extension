import React from 'react'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import useSettings from '@/hooks/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'
import { formatTokenPrice, formatBalance } from '@/utils/formatting'

interface CryptoDetailsTableProps {
  token: {
    tick: string
    balance: number
    floorPrice: number
    dec: number
  }
}

const CryptoDetailsTable: React.FC<CryptoDetailsTableProps> = ({ token }) => {
  const { floorPrice, tick } = token
  console.log('token', token)
  const { settings } = useSettings()
  const price = useKaspaPrice(settings.currency)
  const currencySymbol = getCurrencySymbol(settings.currency)
  const tokenPrice = floorPrice * price
  const formattedTokenPrice = formatTokenPrice(tokenPrice)

  const totalValue = (
    token.tick === 'KASPA'
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
              <td className="text-base font-lato text-mutedtext py-2">{token.tick}</td>
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
      <div className="bg-bgdarker rounded-md py-1 px-4 mb-16">
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
    </div>
  )
}

export default CryptoDetailsTable
