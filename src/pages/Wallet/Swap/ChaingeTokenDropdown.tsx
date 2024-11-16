import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import CryptoImage from '@/components/CryptoImage'

interface ChaingeTokenDropdownProps {
  selectedToken: { symbol: string; contractAddress: string } | null
  openTokenSelect: () => void
}

const ChaingeTokenDropdown: React.FC<ChaingeTokenDropdownProps> = ({ selectedToken, openTokenSelect }) => {
  const isCusdt = selectedToken?.contractAddress === 'CUSDT'
  return (
    <div
      className="relative flex items-center cursor-pointer bg-slightmuted rounded-[26px] p-1.5 hover:bg-muted"
      onClick={openTokenSelect}
    >
      {selectedToken && (
        <CryptoImage
          ticker={isCusdt ? selectedToken.contractAddress : selectedToken.symbol}
          size="extra-small"
        />
      )}
      <span className="ml-2 text-primarytext text-base">
        {isCusdt ? selectedToken.contractAddress : selectedToken?.symbol}
      </span>
      <ChevronDownIcon className="w-4 h-4 ml-2 text-primarytext" />
    </div>
  )
}

export default ChaingeTokenDropdown
