import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PopupMessageDialogProps {
  message: string
  onClose: () => void
}

export function PopupMessageDialog({ message, onClose }: PopupMessageDialogProps) {
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // TODO: don't allow scrolling when dialog is open, or make sure scrolling maintains opacity BG

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      onClick={handleClickOutside}
    >
      <div
        className="bg-bgdark p-6 rounded-lg shadow-lg text-white w-80 max-w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-primarytext font-semibold text-xl">Not Available</h1>
          <button
            className="text-primarytext p-2 hover:bg-slightmuted rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
        <div className="text-base text-mutedtext" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    </div>
  )
}

export default PopupMessageDialog
