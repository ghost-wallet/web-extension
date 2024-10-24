import React, { useState } from 'react'
import RecoveryPhraseInput from './inputs/RecoveryPhraseInput'

interface RecoveryPhraseGridProps {
  values: string[]
  onInputChange: (index: number, value: string) => void
  onPaste: (index: number, event: React.ClipboardEvent<HTMLInputElement>) => void
  editableIndices?: number[]
}

const RecoveryPhraseGrid: React.FC<RecoveryPhraseGridProps> = ({
  values,
  onInputChange,
  onPaste,
  editableIndices = [],
}) => {
  const [visibility, setVisibility] = useState<boolean[]>(Array(values.length).fill(false))

  const toggleVisibility = (index: number) => {
    setVisibility((prev) => prev.map((isVisible, i) => (i === index ? !isVisible : isVisible)))
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center space-x-1 mb-2">
            <span className="text-mutedtext text-base font-lato w-6 text-right">{i + 1}.</span>
            {editableIndices.includes(i) ? (
              <RecoveryPhraseInput
                value={values[i]}
                onChange={(value) => onInputChange(i, value)}
                onPaste={(e) => onPaste(i, e)}
                index={i}
                isVisible={visibility[i]}
                onToggleVisibility={() => toggleVisibility(i)}
              />
            ) : (
              <RecoveryPhraseInput
                value={values[i]}
                onChange={() => {}}
                index={i}
                isVisible={visibility[i]}
                onToggleVisibility={() => toggleVisibility(i)}
                disabled
              />
            )}
          </div>
        ))}
      </div>

      <div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i + 6} className="flex items-center space-x-1 mb-2">
            <span className="text-mutedtext text-base font-lato w-6 text-right">{i + 7}.</span>
            {editableIndices.includes(i + 6) ? (
              <RecoveryPhraseInput
                value={values[i + 6]}
                onChange={(value) => onInputChange(i + 6, value)}
                onPaste={(e) => onPaste(i + 6, e)}
                index={i + 6}
                isVisible={visibility[i + 6]}
                onToggleVisibility={() => toggleVisibility(i + 6)}
              />
            ) : (
              <RecoveryPhraseInput
                value={values[i + 6]}
                onChange={() => {}}
                index={i + 6}
                isVisible={visibility[i + 6]}
                onToggleVisibility={() => toggleVisibility(i + 6)}
                disabled
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecoveryPhraseGrid
