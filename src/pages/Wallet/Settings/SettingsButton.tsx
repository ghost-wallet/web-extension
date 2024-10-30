import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface SettingsButtonProps {
  onClick: () => void
  text?: string
  LeftSideIcon?: React.ElementType
  RightSideIcon?: React.ElementType
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
  onClick,
  text = 'Next',
  LeftSideIcon,
  RightSideIcon = ChevronRightIcon,
}) => (
  <button
    onClick={onClick}
    className="w-full h-[52px] rounded-[10px] text-base font-light text-left cursor-pointer bg-darkmuted hover:bg-slightmuted text-primarytext pl-4 flex items-center justify-start"
  >
    {LeftSideIcon ? <LeftSideIcon className="w-5 h-5 text-primary mr-2" /> : <div className="w-0"></div>}
    <span className="flex-1">{text}</span>
    <RightSideIcon className="w-5 h-5 text-mutedtext mr-4" />
  </button>
)

export default SettingsButton
