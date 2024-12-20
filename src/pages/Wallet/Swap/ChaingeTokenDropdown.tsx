import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import CryptoImage from '@/components/CryptoImage'
import { getChaingeTicker } from '@/utils/labels'

interface ChaingeTokenDropdownProps {
  selectedToken: { symbol: string; contractAddress: string } | null
  openTokenSelect: () => void
}

const ChaingeTokenDropdown: React.FC<ChaingeTokenDropdownProps> = ({ selectedToken, openTokenSelect }) => {
  const ticker = getChaingeTicker(selectedToken)
  return (
    <div
      className="relative flex items-center cursor-pointer bg-slightmuted rounded-[26px] p-1.5 hover:bg-muted"
      onClick={openTokenSelect}
    >
      {selectedToken && <CryptoImage ticker={ticker} size="extra-small" />}
      <span className="ml-2 text-primarytext text-base">{ticker}</span>
      <ChevronDownIcon className="w-4 h-4 ml-2 text-primarytext" />
    </div>
  )
}

export default ChaingeTokenDropdown
