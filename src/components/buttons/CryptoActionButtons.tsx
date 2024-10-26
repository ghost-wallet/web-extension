import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaperAirplaneIcon, ArrowDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'
import { fetchChaingeTokens, ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'

interface CryptoActionButtonsProps {
  token: {
    tick: string
  }
}

const CryptoActionButtons: React.FC<CryptoActionButtonsProps> = ({ token }) => {
  const navigate = useNavigate()
  const [isTokenAvailable, setIsTokenAvailable] = useState(false)

  useEffect(() => {
    const checkTokenAvailability = async () => {
      try {
        const fetchedTokens: ChaingeToken[] = await fetchChaingeTokens()
        const tokenExists = fetchedTokens.some(
          (t) =>
            t.symbol.toLowerCase() === token.tick.toLowerCase() ||
            t.name.toLowerCase() === token.tick.toLowerCase(),
        )
        setIsTokenAvailable(tokenExists)
      } catch (error) {
        console.error('Error checking token availability:', error)
      }
    }
    checkTokenAvailability()
  }, [token.tick])

  return (
    <div className="flex justify-center space-x-4 mt-4">
      <ActionButton
        icon={<ArrowDownIcon strokeWidth={2} />}
        label="Receive"
        onClick={() => navigate('/receive')}
      />
      <ActionButton
        icon={<PaperAirplaneIcon strokeWidth={2} />}
        label="Send"
        onClick={() => navigate(`/send/${token.tick}`, { state: { token } })}
      />
      <ActionButton
        icon={<ArrowsRightLeftIcon strokeWidth={2} />}
        label="Swap"
        onClick={() => isTokenAvailable && navigate('/swap', { state: { token } })}
        disabled={!isTokenAvailable}
        className={!isTokenAvailable ? 'opacity-50 cursor-not-allowed' : ''}
      />
      <ActionButton
        icon={<ArrowsRightLeftIcon strokeWidth={2} />}
        label="Mint"
        onClick={() => navigate(`/mint/${token.tick}`, { state: { token } })}
      />
    </div>
  )
}

export default CryptoActionButtons
