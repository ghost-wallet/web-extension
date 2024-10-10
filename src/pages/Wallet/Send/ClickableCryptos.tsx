import React from 'react'
import { useNavigate } from 'react-router-dom'
import Cryptos from '@/pages/Wallet/Cryptos'
import TokenListItem from '@/components/TokenListItem'

interface Token {
  tick: string
  balance: string
  dec: string
  opScoreMod: string
  floorPrice?: number
}

interface ClickableCryptosProps {
  onTotalValueChange: (value: number) => void
}

const ClickableCryptos: React.FC<ClickableCryptosProps> = ({ onTotalValueChange }) => {
  const navigate = useNavigate()

  const handleTokenClick = (token: Token) => {
    navigate('/send/crypto', { state: { token } })
  }

  return (
    <div className="pb-14">
      <Cryptos
        onTotalValueChange={onTotalValueChange}
        renderTokenItem={(
          token: Token,
          isKaspa: boolean,
          currencySymbol: string,
          kaspaBalance: number,
          kaspaImageSrc: string,
        ) => (
          <button
            key={token.opScoreMod}
            onClick={() => handleTokenClick(token)}
            className="w-full text-left hover:bg-muted transition-colors rounded-[10px]"
          >
            <TokenListItem
              token={token}
              isKaspa={isKaspa}
              currencySymbol={currencySymbol}
              kaspaBalance={kaspaBalance}
              kaspaImageSrc={kaspaImageSrc}
            />
          </button>
        )}
      />
    </div>
  )
}

export default ClickableCryptos
