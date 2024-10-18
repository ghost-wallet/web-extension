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
    <div className="flex items-center gap-2 bg-bgdarker rounded-md cursor-pointer" onClick={handleCopy}>
      {copied ? (
        <>
          <span className="text-base font-lato text-primary">Copied</span>
          <CheckIcon className="h-5 w-5 text-base font-lato text-primary" />
        </>
      ) : (
        <div
          className="flex items-center gap-2 bg-bgdarker rounded-md cursor-pointer group"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <span className="text-success">Copied</span>
              <CheckIcon className="h-5 w-5 text-success" />
            </>
          ) : (
            <>
              <span
                className="text-base font-lato text-primarytext group-hover:text-primary"
                style={{ maxWidth: 'calc(100% - 30px)' }} // Ensures space for icon
              >
                {truncateAddress(address)}
              </span>
              <DocumentDuplicateIcon className="h-5 w-5 text-primarytext group-hover:text-primary transition" />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default RecipientAddress
