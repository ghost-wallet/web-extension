import React from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/solid'

interface SwitchChaingeTokensProps {
  onSwitch: () => void
}

const SwitchChaingeTokens: React.FC<SwitchChaingeTokensProps> = ({ onSwitch }) => {
  return (
    <div className="flex justify-center -my-2">
      <button className="bg-primary rounded-full p-2 hover:bg-secondary" onClick={onSwitch}>
        <ArrowsUpDownIcon className="w-5 h-5 text-secondarytext" />
      </button>
    </div>
  )
}

export default SwitchChaingeTokens
