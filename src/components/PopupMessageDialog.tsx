import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

interface PopupMessageDialogProps {
  message: string
  isOpen: boolean
  onClose: () => void
}

export function PopupMessageDialog({ message, onClose, isOpen }: PopupMessageDialogProps) {

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">

      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-70" />

      <div
        className="fixed inset-0 flex items-center justify-center"
      >
        <DialogPanel 
          className="bg-bgdark p-6 rounded-lg shadow-lg text-white w-80 max-w-full relative"
          //onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <DialogTitle  className="text-primarytext font-semibold text-xl">Not Available</DialogTitle >
            <button
              className="text-primarytext p-2 hover:bg-slightmuted rounded-full transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>
          </div>
          <Description className="text-base text-mutedtext" dangerouslySetInnerHTML={{ __html: message }} />
        </DialogPanel >
      </div>
    </Dialog>
  )
}

export default PopupMessageDialog
