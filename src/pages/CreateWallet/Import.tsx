import React, { useState, useEffect } from 'react';
import RecoveryPhraseGrid from '@/components/RecoveryPhraseGrid';
import * as bip39 from 'bip39'
import { Buffer } from 'buffer'

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer
}

export default function Import({
                                 onMnemonicsSubmit,
                               }: {
  onMnemonicsSubmit: (mnemonics: string) => void;
}) {
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(''));
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    const validateSeedPhrase = () => {
      const areAllFilled = userInputs.every((word) => word.trim() !== '');
      if (areAllFilled) {
        const phrase = userInputs.map((word) => word.trim().toLowerCase()).join(' ');
        const isValidBip39 = bip39.validateMnemonic(phrase)
        setIsValid(isValidBip39);
      } else {
        setIsValid(false);
      }
    };
    validateSeedPhrase();
  }, [userInputs]);

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text');
    const words = pasteData.split(/\s+/).filter((word) => word.trim() !== '');

    if (words.length > 0) {
      const updatedInputs = [...userInputs];
      let wordIndex = 0;

      for (let i = index; i < updatedInputs.length && wordIndex < words.length; i++) {
        updatedInputs[i] = words[wordIndex].toLowerCase().trim();
        wordIndex++;
      }

      setUserInputs(updatedInputs);
    }
  };

  return (
    <main className="pt-10 px-6">
      <div className="flex flex-col items-center">
        <h1 className="text-primarytext text-3xl font-rubik text-center mb-2">
          Secret Recovery Phrase
        </h1>
        <p className="text-mutedtext text-lg font-lato text-center mb-8">
          Import an existing wallet with your 12-word secret recovery phrase.
        </p>
        <RecoveryPhraseGrid
          values={userInputs}
          onInputChange={(i, value) =>
            setUserInputs((inputs) => {
              const updated = [...inputs];
              updated[i] = value.trim().toLowerCase();
              return updated;
            })
          }
          onPaste={handlePaste}
          editableIndices={Array.from({ length: 12 }, (_, i) => i)}
        />
        <div className="fixed bottom-0 left-0 w-full px-6 pb-10">
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onMnemonicsSubmit(userInputs.join(' '))}
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
  );
}
