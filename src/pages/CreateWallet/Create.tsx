import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import NextButton from '@/components/buttons/NextButton'

export default function Create({ mnemonic, onSaved }: { mnemonic: string; onSaved: () => void }) {
  const [isSeedVisible, setIsSeedVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const toggleSeedVisibility = () => {
    setIsSeedVisible(!isSeedVisible)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(e.target.checked)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic)
      setIsCopied(true)
    } catch (err) {
      console.error('Failed to copy seed phrase:', err)
    }
  }

  return (
    <AnimatedMain showConnectingMessage={false} className="flex flex-col h-screen">
      <Header title="Secret Phrase" showBackButton={false} />

      <div className="flex flex-col flex-grow justify-center px-4 pb-6 space-y-4">
        <p className="text-warning text-base text-justify pt-4 mb-4">
          This secret recovery phrase is the only way to restore your wallet. Do not share it with anyone. Do
          not enter it into any app or site other than wallets from ghostapp.org. Beware of fake customer
          support scams.
        </p>

        <div
          className="bg-bgdarker border border-muted rounded-lg p-4 mb-4 relative text-primarytext text-sm cursor-pointer"
          onClick={toggleSeedVisibility}
        >
          <div className="flex justify-between items-center">
            <textarea
              value={mnemonic}
              readOnly
              rows={3}
              className={`w-full bg-transparent border-none focus:outline-none resize-none cursor-pointer ${
                isSeedVisible ? '' : 'blur-sm'
              }`}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleSeedVisibility()
              }}
              className="ml-2 text-secondarytext"
            >
              {isSeedVisible ? (
                <EyeIcon className="h-7 w-7 text-mutedtext" />
              ) : (
                <EyeSlashIcon className="h-7 w-7 text-mutedtext" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleCopyToClipboard}
          className="flex items-center text-mutedtext text-base mb-4 cursor-pointer"
        >
          <span className="mr-2">
            {isCopied ? (
              <DocumentCheckIcon className="h-7 w-7 text-success" />
            ) : (
              <DocumentDuplicateIcon className="h-7 w-7 text-mutedtext" />
            )}
          </span>
          {isCopied ? 'Copied' : 'Copy to clipboard'}
        </button>

        <div className="flex gap-3 justify-start items-center p-2 mt-8 mb-8">
          <input
            type="checkbox"
            id="confirmation"
            className="cursor-pointer transform scale-150"
            checked={isConfirmed}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="confirmation" className="text-mutedtext text-base">
            I saved my secret recovery phrase.
          </label>
        </div>
      </div>

      <div className="w-full px-4 pb-10">
        <NextButton onClick={onSaved} buttonEnabled={isConfirmed} />
      </div>
    </AnimatedMain>
  )
}
