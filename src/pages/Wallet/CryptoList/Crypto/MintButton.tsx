import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BoltIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'

interface MintButtonProps {
  tokenTick: string
  className?: string
}

const MintButton: React.FC<MintButtonProps> = ({ tokenTick, className }) => {
  const navigate = useNavigate()

  const handleMintClick = () => {
    navigate(`/mint`, { state: { ticker: tokenTick } })
  }

  return (
    <>
      <ActionButton
        icon={<BoltIcon strokeWidth={2} />}
        label="Mint"
        onClick={handleMintClick}
        className={className}
      />
    </>
  )
}

export default MintButton
