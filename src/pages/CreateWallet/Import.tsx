import React, { useState, useEffect } from 'react'
import RecoveryPhraseGrid from '@/components/RecoveryPhraseGrid'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import * as bip39 from 'bip39'
import { Buffer } from 'buffer'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer
}

export default function Import({ onMnemonicsSubmit }: { onMnemonicsSubmit: (mnemonics: string) => void }) {
  const [is24Words, setIs24Words] = useState<boolean>(false)
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(''))
  const [textAreaInput, setTextAreaInput] = useState<string>('') // For the 24-word input
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isTextVisible, setIsTextVisible] = useState<boolean>(false) // State to control visibility of textarea

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
    setUserInputs(Array(12).fill(''))
    setTextAreaInput('')
    setIsValid(false)
  }

  const toggleTextVisibility = () => {
    setIsTextVisible(!isTextVisible)
  }

  return (
    <AnimatedMain>
      <div className="flex flex-col items-center">
        <Header title="Import" showBackButton={false} />
        <div className="px-6">
          <p className="text-mutedtext text-lg font-lato text-center mb-4">
            Import an existing wallet with your {is24Words ? '24-word' : '12-word'} secret recovery phrase.
          </p>
          <div className="flex justify-center mb-6">
            <button
              onClick={handleToggle}
              className="text-center text-base font-semibold text-primary font-lato hover:underline"
            >
              {is24Words ? 'Switch to 12 words' : 'Switch to 24 words'}
            </button>
          </div>

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
            <div className="relative w-full">
              <textarea
                value={textAreaInput}
                onChange={(e) => setTextAreaInput(e.target.value)}
                placeholder="Enter or paste your 24-word secret recovery phrase"
                className={`w-full h-48 border border-muted rounded-lg p-4 bg-bgdarker text-mutedtext font-lato text-base resize-none`}
                style={
                  {
                    WebkitTextSecurity: isTextVisible ? 'none' : 'disc',
                  } as React.CSSProperties
                }
              />
              <button
                type="button"
                onClick={toggleTextVisibility}
                className="absolute right-4 bottom-4 text-mutedtext"
              >
                {isTextVisible ? <EyeIcon className="h-8 w-8" /> : <EyeSlashIcon className="h-8 w-8" />}
              </button>
            </div>
          )}
        </div>

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
    </AnimatedMain>
  )
}
