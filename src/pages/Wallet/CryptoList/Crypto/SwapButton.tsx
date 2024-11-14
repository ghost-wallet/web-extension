import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'
import { ChaingeToken, useChaingeTokens } from '@/hooks/chainge/useChaingeTokens'
import PopupMessageDialog from '@/components/messages/PopupMessageDialog'
import { Token } from '@/utils/interfaces'

interface SwapButtonProps {
  token: Token
  className?: string
}

const SwapButton: React.FC<SwapButtonProps> = ({ token, className }) => {
  const navigate = useNavigate()
  const [isTokenAvailable, setIsTokenAvailable] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { data: fetchedTokens, isError, error } = useChaingeTokens()

  useEffect(() => {
    if (isError) {
      console.error('Error checking token availability:', error)
      return
    }

    if (fetchedTokens) {
      const tokenExists = fetchedTokens.some(
        (t: ChaingeToken) =>
          t.symbol.toLowerCase() === token.tick.toLowerCase() ||
          t.name.toLowerCase() === token.tick.toLowerCase() ||
          t.contractAddress.toLowerCase() === token.tick.toLowerCase(),
      )
      setIsTokenAvailable(tokenExists)
    }
  }, [fetchedTokens, token.tick, isError, error])

  const handleSwapClick = () => {
    if (isTokenAvailable) {
      navigate('/swap', { state: { token } })
    } else {
      setShowDialog(true)
    }
  }

  return (
    <>
      <ActionButton
        icon={<ArrowsRightLeftIcon strokeWidth={2} />}
        label="Swap"
        onClick={handleSwapClick}
        className={className}
      />

      <PopupMessageDialog
        title={'Not Available'}
        message={`${token.tick} is not yet supported for swapping on the Chainge KRC20 DEX. See if it's on Chainge's waiting list <a href="https://krc20.chainge.finance/" target="_blank" rel="noopener noreferrer" class="text-primary text-base underline">here</a>. You can help get the token listed for trading by adding liquidity.`}
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
      />
    </>
  )
}

export default SwapButton
