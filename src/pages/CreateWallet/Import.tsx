import React, { useState, useEffect } from 'react'
import RecoveryPhraseGrid from '@/components/RecoveryPhraseGrid'
import * as bip39 from 'bip39'
import { Buffer } from 'buffer'

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer
}

export default function Import({ onMnemonicsSubmit }: { onMnemonicsSubmit: (mnemonics: string) => void }) {
  // State to track 12-word or 24-word mode
  const [is24Words, setIs24Words] = useState<boolean>(false)
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(''))
  const [textAreaInput, setTextAreaInput] = useState<string>('') // For the 24-word input
  const [isValid, setIsValid] = useState<boolean>(false)

  useEffect(() => {
    const validateSeedPhrase = () => {
      if (is24Words) {
        const words = textAreaInput.trim().split(/\s+/)
        if (words.length === 24) {
          const phrase = words.join(' ')
          const isValidBip39 = bip39.validateMnemonic(phrase)
          setIsValid(isValidBip39)
        } else {
          setIsValid(false)
        }
      } else {
        const areAllFilled = userInputs.every((word) => word.trim() !== '')
        if (areAllFilled) {
          const phrase = userInputs.map((word) => word.trim().toLowerCase()).join(' ')
          const isValidBip39 = bip39.validateMnemonic(phrase)
          setIsValid(isValidBip39)
        } else {
          setIsValid(false)
        }
      }
    }
    validateSeedPhrase()
  }, [userInputs, textAreaInput, is24Words])

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasteData = event.clipboardData.getData('text')
    const words = pasteData.split(/\s+/).filter((word) => word.trim() !== '')

    if (words.length > 0) {
      const updatedInputs = [...userInputs]
      let wordIndex = 0

      for (let i = index; i < updatedInputs.length && wordIndex < words.length; i++) {
        updatedInputs[i] = words[wordIndex].toLowerCase().trim()
        wordIndex++
      }

      setUserInputs(updatedInputs)
    }
  }

  const handleToggle = () => {
    setIs24Words((prev) => !prev)
    setUserInputs(Array(12).fill('')) // Reset input if switching from 24 to 12
    setTextAreaInput('') // Reset text area if switching from 12 to 24
    setIsValid(false) // Reset validation status
  }

  return (
    <main className="pt-10 px-6">
      <div className="flex flex-col items-center">
        <h1 className="text-primarytext text-3xl font-rubik text-center mb-2">Secret Recovery Phrase</h1>
        <p className="text-mutedtext text-lg font-lato text-center mb-4">
          Import an existing wallet with your {is24Words ? '24-word' : '12-word'} secret recovery phrase.
        </p>

        <button
          onClick={handleToggle}
          className="mb-6 text-base font-semibold text-primary font-lato hover:underline"
        >
          {is24Words ? 'Switch to 12 words' : 'Switch to 24 words'}
        </button>

        {/* Conditionally render either the grid or the textarea */}
        {!is24Words ? (
          <RecoveryPhraseGrid
            values={userInputs}
            onInputChange={(i, value) =>
              setUserInputs((inputs) => {
                const updated = [...inputs]
                updated[i] = value.trim().toLowerCase()
                return updated
              })
            }
            onPaste={handlePaste}
            editableIndices={Array.from({ length: 12 }, (_, i) => i)}
          />
        ) : (
          <textarea
            value={textAreaInput}
            onChange={(e) => setTextAreaInput(e.target.value)}
            placeholder="Enter or paste your 24-word recovery phrase"
            className="w-full h-32 border rounded-lg p-4 bg-bgdarker text-primarytext font-lato font-base"
          />
        )}

        <div className="fixed bottom-0 left-0 w-full px-6 pb-10">
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onMnemonicsSubmit(is24Words ? textAreaInput : userInputs.join(' '))}
            className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
              isValid
                ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
                : 'bg-secondary text-secondarytext cursor-default'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  )
}
