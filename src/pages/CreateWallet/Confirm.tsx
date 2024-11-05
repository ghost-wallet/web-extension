import React, { useEffect, useState } from 'react'
import RecoveryPhraseGrid from '@/components/RecoveryPhraseGrid'
import ErrorMessage from '@/components/messages/ErrorMessage'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import NextButton from '@/components/buttons/NextButton'

export default function Confirm({ mnemonic, onConfirmed }: { mnemonic: string; onConfirmed: () => void }) {
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(''))
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const initialWords = mnemonic
      .split(' ')
      .map((word, index) => (index === 2 || index === 4 || index === 7 ? '' : word))
    setUserInputs(initialWords)
  }, [mnemonic])

  const handleValidateEntries = () => {
    const mnemonicWords = mnemonic.split(' ')
    const isEntryBlank = userInputs[2] === '' || userInputs[4] === '' || userInputs[7] === ''
    const isEntryIncorrect =
      (userInputs[2] && userInputs[2] !== mnemonicWords[2]) ||
      (userInputs[4] && userInputs[4] !== mnemonicWords[4]) ||
      (userInputs[7] && userInputs[7] !== mnemonicWords[7])

    if (isEntryBlank || isEntryIncorrect) {
      setError('Incorrect entries')
    } else {
      setError('')
      onConfirmed()
    }
  }

  const handleClearClick = () => {
    setUserInputs((inputs) => {
      const clearedInputs = [...inputs]
      clearedInputs[2] = ''
      clearedInputs[4] = ''
      clearedInputs[7] = ''
      return clearedInputs
    })
    setError('')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleValidateEntries()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleValidateEntries])

  return (
    <AnimatedMain className="flex flex-col h-screen">
      <Header title="Confirm Secret Phrase" showBackButton={false} />
      <div className="px-4">
        <p className="text-mutedtext text-lg text-center mb-6">Enter the 3rd, 5th, and 8th missing words.</p>
        <RecoveryPhraseGrid
          values={userInputs}
          onInputChange={(i, value) =>
            setUserInputs((inputs) => {
              const updated = [...inputs]
              updated[i] = value
              return updated
            })
          }
          onPaste={() => {}}
          editableIndices={[2, 4, 7]}
        />

        <ErrorMessage message={error} />
      </div>

      <div className="w-full px-4 pb-10">
        <button
          onClick={handleClearClick}
          className="mb-4 w-full h-[52px] text-base font-semibold text-primary hover:underline cursor-pointer"
        >
          Clear Entries
        </button>

        <NextButton onClick={handleValidateEntries} />
      </div>
    </AnimatedMain>
  )
}
