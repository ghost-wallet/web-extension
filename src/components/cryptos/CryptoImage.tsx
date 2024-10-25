import React from 'react'
import kaspaSvg from '../../../assets/crypto-logos/kaspa-kas-logo.svg'
import bitcoinSvg from '../../../assets/crypto-logos/bitcoin-btc-logo.svg'
import ethSvg from '../../../assets/crypto-logos/ethereum-eth-logo.svg'
import usdtSvg from '../../../assets/crypto-logos/tether-usdt-logo.svg'
import usdcSvg from '../../../assets/crypto-logos/usd-coin-usdc-logo.svg'

interface CryptoImageProps {
  ticker: string
  size: 'extra-small' | 'small' | 'large'
}

const localSvgMap: { [key: string]: string } = {
  KASPA: kaspaSvg,
  KAS: kaspaSvg,
  BTC: bitcoinSvg,
  ETH: ethSvg,
  USDT: usdtSvg,
  USDC: usdcSvg,
}

const CryptoImage: React.FC<CryptoImageProps> = ({ ticker, size }) => {
  const dimensions = size === 'large' ? 'w-20 h-20' : size === 'small' ? 'w-12 h-12' : 'w-8 h-8'
  const localSvg = localSvgMap[ticker]

  const isRounded = localSvg !== usdtSvg // Only omit rounding for USDT logo

  return (
    <div className="flex flex-col items-center">
      <img
        src={localSvg || `https://krc20-assets.kas.fyi/icons/${ticker}.jpg`}
        alt={`${ticker} logo`}
        className={`${dimensions} ${isRounded ? 'rounded-full' : ''} object-cover`}
      />
    </div>
  )
}

export default CryptoImage
