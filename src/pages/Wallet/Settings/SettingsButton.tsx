import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface SettingsButtonProps {
  onClick: () => void
  text?: string
  Icon: React.ElementType
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick, text = 'Next', Icon }) => (
  <button
    onClick={onClick}
    className="w-full h-[52px] rounded-[10px] text-lg font-lato text-left cursor-pointer bg-darkmuted hover:bg-slightmuted text-primarytext pl-4 flex items-center justify-start" // Align items to the left
  >
    <Icon className="w-5 h-5 text-primarytext mr-2" />
    <span className="flex-1">{text}</span>
    <ChevronRightIcon className="w-5 h-5 text-primarytext mr-4" />
  </button>
)

export default SettingsButton
