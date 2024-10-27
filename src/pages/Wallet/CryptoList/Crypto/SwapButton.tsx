import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'
import { fetchChaingeTokens, ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import PopupMessageDialog from '@/components/PopupMessageDialog'
import { Token } from '@/utils/interfaces'

interface SwapButtonProps {
  token: Token
}

const SwapButton: React.FC<SwapButtonProps> = ({ token }) => {
  const navigate = useNavigate()
  const [isTokenAvailable, setIsTokenAvailable] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

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

  const handleSwapClick = () => {
    if (isTokenAvailable) {
      navigate('/swap', { state: { token } })
    } else {
      setShowDialog(true)
    }
  }

  return (
    <>
      <ActionButton icon={<ArrowsRightLeftIcon strokeWidth={2} />} label="Swap" onClick={handleSwapClick} />

      {showDialog && (
        <PopupMessageDialog
          message={`Chainge Finance's KRC20 DEX does not support ${token.tick}, yet. You can see if it's on Chainge's waiting list <a href="https://krc20.chainge.finance/" target="_blank" rel="noopener noreferrer" class="text-primary font-lato text-base underline">here</a>.`}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  )
}

export default SwapButton