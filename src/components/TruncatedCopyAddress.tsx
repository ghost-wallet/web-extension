import React, { useState } from 'react'
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'
import { truncateAddress, truncateWord } from '@/utils/formatting'

interface RecipientAddressProps {
  address: string
  account?: string
}

const TruncatedCopyAddress: React.FC<RecipientAddressProps> = ({ address, account }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    })
  }

  return (
    <div className="inline-flex items-center space-x-1 cursor-pointer group" onClick={handleCopy}>
      {copied ? (
        <>
          <span className="text-base text-primary">Copied</span>
          <CheckIcon className="h-5 w-5 text-primary" />
        </>
      ) : (
        <>
          <span className="text-base text-primarytext group-hover:text-primary transition">
            {account ? truncateWord(account) : truncateAddress(address)}
          </span>
          <DocumentDuplicateIcon className="h-5 w-5 text-primarytext group-hover:text-primary transition" />
        </>
      )}
    </div>
  )
}

export default TruncatedCopyAddress
