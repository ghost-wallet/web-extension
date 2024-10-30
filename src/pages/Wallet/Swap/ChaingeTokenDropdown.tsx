import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import CryptoImage from '@/components/CryptoImage'

interface ChaingeTokenDropdownProps {
  selectedToken: { symbol: string } | null
  openTokenSelect: () => void
}

const ChaingeTokenDropdown: React.FC<ChaingeTokenDropdownProps> = ({ selectedToken, openTokenSelect }) => {
  return (
    <div
      className="relative flex items-center cursor-pointer bg-slightmuted rounded-[26px] p-1.5"
      onClick={openTokenSelect} // Open token select modal
    >
      {selectedToken && <CryptoImage ticker={selectedToken.symbol} size="extra-small" />}
      <span className="ml-2 text-primarytext text-base">{selectedToken?.symbol}</span>
      <ChevronDownIcon className="w-4 h-4 ml-2 text-primarytext" />
    </div>
  )
}

export default ChaingeTokenDropdown
