import React, { useState } from 'react'
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'
import { truncateAddress } from '@/utils/formatting'

interface RecipientAddressProps {
  address: string
}

const TruncatedCopyAddress: React.FC<RecipientAddressProps> = ({ address }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    })
  }

  return (
    <div className="inline-flex cursor-pointer" onClick={handleCopy}>
      {copied ? (
        <>
          <span className="text-base text-primary">Copied</span>
          <CheckIcon className="h-5 w-5 text-primary" />
        </>
      ) : (
        <>
          <span className="text-base text-primarytext">{truncateAddress(address)}</span>
          <DocumentDuplicateIcon className="h-5 w-5 text-primarytext transition" />
        </>
      )}
    </div>
  )
}

export default TruncatedCopyAddress