import React, { useState, useEffect } from 'react'
import kaspaSvg from '../../assets/crypto-logos/kaspa-kas-logo.svg'
import krc20Default from '../../assets/crypto-logos/krc20-default.svg'

interface CryptoImageProps {
  ticker: string
  size: 'extra-small' | 'small' | 'large'
}

const localSvgMap: { [key: string]: string } = {
  KASPA: kaspaSvg,
  KAS: kaspaSvg,
}

const CryptoImage: React.FC<CryptoImageProps> = ({ ticker, size }) => {
  const [hasFailed, setHasFailed] = useState<boolean>(false)

  useEffect(() => {
    setHasFailed(false)
  }, [ticker])

  const imgSrc = hasFailed
    ? krc20Default
    : ticker in localSvgMap
      ? localSvgMap[ticker]
      : `https://krc20-assets.kas.fyi/icons/${ticker}.jpg`

  const dimensions = size === 'large' ? 'w-20 h-20' : size === 'small' ? 'w-12 h-12' : 'w-8 h-8'

  return (
    <div className="flex flex-col items-center">
      <img
        src={imgSrc}
        alt={`${ticker} logo`}
        loading="lazy"
        className={`${dimensions} rounded-full object-cover`}
        onError={() => setHasFailed(true)}
      />
    </div>
  )
}

export default CryptoImage
