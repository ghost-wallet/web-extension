import React, { useEffect, useState } from 'react'
import RecoveryPhraseGrid from '@/components/RecoveryPhraseGrid'

export default function Confirm({ mnemonic, onConfirmed }: { mnemonic: string; onConfirmed: () => void }) {
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(''))
  const [isValid, setIsValid] = useState<boolean>(false)

  useEffect(() => {
    const initialWords = mnemonic
      .split(' ')
      .map((word, index) => (index === 2 || index === 4 || index === 7 ? '' : word))
    setUserInputs(initialWords)
  }, [mnemonic])

  useEffect(() => {
    const areAllFilled = userInputs[2] !== '' && userInputs[4] !== '' && userInputs[7] !== ''
    const areCorrect =
      userInputs[2] === mnemonic.split(' ')[2] &&
      userInputs[4] === mnemonic.split(' ')[4] &&
      userInputs[7] === mnemonic.split(' ')[7]
    setIsValid(areAllFilled && areCorrect)
  }, [userInputs, mnemonic])

  return (
    <main className="p-6">
      <h1 className="text-primarytext text-3xl font-rubik text-center mb-2">
        Confirm Secret Recovery Phrase
      </h1>
      <p className="text-mutedtext text-lg font-lato text-center mb-14">Enter the missing words.</p>
      <RecoveryPhraseGrid
        values={userInputs}
        seedPhrase={mnemonic.split(' ')}
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
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10">
        <button
          onClick={onConfirmed}
          disabled={!isValid}
          className={`mt-8 w-full max-w-md h-[52px] text-base font-lato font-semibold rounded-[25px] ${
            isValid
              ? 'bg-primary text-secondarytext hover:bg-hover cursor-pointer'
              : 'bg-secondary text-secondarytext cursor-default opacity-50'
          }`}
        >
          Confirm
        </button>
      </div>
    </main>
  )
}
