import React, { useState } from 'react'
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'
import { truncateAddress } from '@/utils/formatting'

interface RecipientAddressProps {
  address: string
}

const RecipientAddress: React.FC<RecipientAddressProps> = ({ address }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    })
  }

  return (
    <div className="flex cursor-pointer" onClick={handleCopy}>
      {copied ? (
        <>
          <span className="text-base font-lato text-primary">Copied</span>
          <CheckIcon className="h-5 w-5 text-primary" />
        </>
      ) : (
        <>
          <span className="text-base font-lato text-primarytext">{truncateAddress(address)}</span>
          <DocumentDuplicateIcon className="h-5 w-5 text-primarytext transition" />
        </>
      )}
    </div>
  )
}

export default RecipientAddress
