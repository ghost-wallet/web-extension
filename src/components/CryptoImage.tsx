import React, { useState, useEffect } from 'react'
import kaspaSvg from '../../assets/crypto-logos/kaspa-kas-logo.svg'
import bitcoinSvg from '../../assets/crypto-logos/bitcoin-btc-logo.svg'
import ethSvg from '../../assets/crypto-logos/ethereum-eth-logo.svg'
import usdtSvg from '../../assets/crypto-logos/tether-usdt-logo.svg'
import usdcSvg from '../../assets/crypto-logos/usd-coin-usdc-logo.svg'
import krc20Default from '../../assets/crypto-logos/KRC20Default.png'

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
  const [hasFailed, setHasFailed] = useState<boolean>(false)

  const imgSrc = hasFailed
    ? krc20Default
    : ticker in localSvgMap
      ? localSvgMap[ticker]
      : `https://krc20-assets.kas.fyi/icons/${ticker}.jpg`

  const dimensions = size === 'large' ? 'w-20 h-20' : size === 'small' ? 'w-12 h-12' : 'w-8 h-8'
  const isRounded = ticker !== 'USDT' // Only omit rounding for USDT logo

  return (
    <div className="flex flex-col items-center">
      <img
        src={imgSrc}
        alt={`${ticker} logo`}
        loading='lazy'
        className={`${dimensions} ${isRounded ? 'rounded-full' : ''} object-cover`}
        onError={() => setHasFailed(true)}
      />
    </div>
  )
}

export default CryptoImage
