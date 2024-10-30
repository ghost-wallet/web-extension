import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BoltIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import PopupMessageDialog from '@/components/PopupMessageDialog'
import { getMintedPercentage } from '@/utils/calculations'
import { KRC20TokenResponse } from '@/utils/interfaces'

interface MintButtonProps {
  tokenTick: string
  className?: string
}

const MintButton: React.FC<MintButtonProps> = ({ tokenTick, className }) => {
  const navigate = useNavigate()
  const [showMintDialog, setShowMintDialog] = useState(false)
  const [mintedPercentage, setMintedPercentage] = useState<number>(0)
  const [tokenInfo, setTokenInfo] = useState<KRC20TokenResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getTokenMintingInfo = async () => {
      try {
        setLoading(true)
        const _tokenInfo = await fetchKrc20TokenInfo(0, tokenTick)
        if (_tokenInfo) {
          setTokenInfo(_tokenInfo)
          const percentage = getMintedPercentage(_tokenInfo.minted, _tokenInfo.max)
          setMintedPercentage(percentage)
        }
      } catch (error) {
        console.error('Error fetching token minting info:', error)
      } finally {
        setLoading(false)
      }
    }
    getTokenMintingInfo()
  }, [tokenTick])

  const handleMintClick = () => {
    if (loading) {
      // If still loading, do nothing
      return
    }

    if (tokenTick.toUpperCase() === 'KASPA' || mintedPercentage === 100) {
      setShowMintDialog(true)
    } else {
      navigate(`/mint/${tokenTick}`, { state: { token: tokenInfo } })
    }
  }

  return (
    <>
      <ActionButton
        icon={<BoltIcon strokeWidth={2} />}
        label="Mint"
        onClick={handleMintClick}
        className={className}
      />
      <PopupMessageDialog
        message={`The entire ${tokenTick} supply has already been minted.`}
        onClose={() => setShowMintDialog(false)}
        isOpen={showMintDialog}
      />
    </>
  )
}

export default MintButton
