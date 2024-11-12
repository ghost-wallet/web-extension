import React, { useState, useEffect } from 'react'
import RecoveryPhraseGrid from '@/components/RecoveryPhraseGrid'
import * as bip39 from 'bip39'
import { Buffer } from 'buffer'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import NextButton from '@/components/buttons/NextButton'

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer
}

export default function Import({ onMnemonicsSubmit }: { onMnemonicsSubmit: (mnemonics: string) => void }) {
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(''))
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const validateSeedPhrase = () => {
      const areAllFilled = userInputs.every((word) => word.trim() !== '')
      if (areAllFilled) {
        const phrase = userInputs.map((word) => word.trim().toLowerCase()).join(' ')
        const isValidBip39 = bip39.validateMnemonic(phrase)
        setIsValid(isValidBip39)
      } else {
        setIsValid(false)
      }
    }
    validateSeedPhrase()
  }, [userInputs])

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

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await onMnemonicsSubmit(userInputs.join(' '))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatedMain className="flex flex-col h-screen pt-5">
      <Header title="Import" showBackButton={false} />
      <div className="flex flex-col items-center flex-grow justify-center px-4 pb-6">
        <p className="text-mutedtext text-lg text-center mb-4">
          Import an existing wallet with your {'12-word'} secret recovery phrase.
        </p>
        <div className="flex justify-center mb-6"></div>

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
      </div>

      <div className="w-full px-4 pb-10">
        <NextButton onClick={handleSubmit} buttonEnabled={isValid && !isLoading} loading={isLoading} />
      </div>
    </AnimatedMain>
  )
}
