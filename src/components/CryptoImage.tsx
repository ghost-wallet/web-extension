import React from 'react'
import kaspaSvg from '../../assets/kaspa-kas-logo.svg'

interface CryptoImageProps {
  ticker: string
  size: 'small' | 'large'
}

const CryptoImage: React.FC<CryptoImageProps> = ({ ticker, size }) => {
  const dimensions = size === 'large' ? 'w-20 h-20' : 'w-12 h-12'

  return (
    <div className="flex flex-col items-center">
      <img
        src={ticker === 'KASPA' ? kaspaSvg : `https://krc20-assets.kas.fyi/icons/${ticker}.jpg`}
        alt={`${ticker} logo`}
        className={`${dimensions} rounded-full object-cover`}
      />
    </div>
  )
}

export default CryptoImage
