import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import PopupMessageDialog from '@/components/PopupMessageDialog'
import { getMintedPercentage } from '@/utils/calculations'

interface MintButtonProps {
  tokenTick: string
}

const MintButtonOnCryptoPage: React.FC<MintButtonProps> = ({ tokenTick }) => {
  const navigate = useNavigate()
  const [showMintDialog, setShowMintDialog] = useState(false)
  const [mintedPercentage, setMintedPercentage] = useState<string>('0')

  useEffect(() => {
    const getTokenMintingInfo = async () => {
      try {
        const tokenInfo = await fetchKrc20TokenInfo(0, tokenTick) // Replace 0 with actual selectedNode if available
        if (tokenInfo) {
          const percentage = getMintedPercentage(tokenInfo.minted, tokenInfo.max)
          setMintedPercentage(percentage)
        }
      } catch (error) {
        console.error('Error fetching token minting info:', error)
      }
    }
    getTokenMintingInfo()
  }, [tokenTick])

  const handleMintClick = () => {
    if (tokenTick.toUpperCase() === 'KASPA' || mintedPercentage === '100.00') {
      setShowMintDialog(true)
    } else {
      navigate(`/mint/${tokenTick}`, { state: { token: { tick: tokenTick } } })
    }
  }

  return (
    <>
      <ActionButton icon={<ArrowsRightLeftIcon strokeWidth={2} />} label="Mint" onClick={handleMintClick} />

      {showMintDialog && (
        <PopupMessageDialog
          message={`The entire ${tokenTick} supply has already been minted.`}
          onClose={() => setShowMintDialog(false)}
        />
      )}
    </>
  )
}

export default MintButtonOnCryptoPage
