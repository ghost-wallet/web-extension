import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PopupMessageDialogProps {
  message: string
  onClose: () => void
}

const PopupMessageDialog: React.FC<PopupMessageDialogProps> = ({ message, onClose }) => {
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
      onClick={handleClickOutside}
    >
      <div
        className="bg-darkmuted p-6 rounded-lg shadow-lg text-white w-80 max-w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-lato text-primarytext font-semibold text-xl">Not Available</h1>
          <button className="text-primarytext p-2" onClick={onClose} aria-label="Close">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="text-base text-mutedtext font-lato" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    </div>
  )
}

export default PopupMessageDialog
