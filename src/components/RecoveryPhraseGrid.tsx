import React from 'react';
import RecoveryPhraseInput from './RecoveryPhraseInput';

interface RecoveryPhraseGridProps {
  values: string[];
  seedPhrase?: string[];
  onInputChange: (index: number, value: string) => void;
  onPaste: (index: number, event: React.ClipboardEvent<HTMLInputElement>) => void;
  editableIndices?: number[];
}

const RecoveryPhraseGrid: React.FC<RecoveryPhraseGridProps> = ({
                                                                 values,
                                                                 seedPhrase,
                                                                 onInputChange,
                                                                 onPaste,
                                                                 editableIndices = [],
                                                               }) => (
  <div className="grid grid-cols-2 gap-8">
    {/* Left column: 1-6 */}
    <div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center space-x-1 mb-2">
          <span className="text-mutedtext text-base font-lato w-6 text-right">
            {i + 1}.
          </span>
          {editableIndices.includes(i) ? (
            <RecoveryPhraseInput
              value={values[i]}
              onChange={(value) => onInputChange(i, value)}
              onPaste={(e) => onPaste(i, e)}
              index={i}
            />
          ) : (
            <span className="bg-bgdarker border border-muted rounded px-2 text-primarytext text-sm w-full flex items-center h-8 cursor-default">
              {seedPhrase ? seedPhrase[i] : values[i]}
            </span>
          )}
        </div>
      ))}
    </div>

    {/* Right column: 7-12 */}
    <div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i + 6} className="flex items-center space-x-1 mb-2">
          <span className="text-mutedtext text-base font-lato w-6 text-right">
            {i + 7}.
          </span>
          {editableIndices.includes(i + 6) ? (
            <RecoveryPhraseInput
              value={values[i + 6]}
              onChange={(value) => onInputChange(i + 6, value)}
              onPaste={(e) => onPaste(i + 6, e)}
              index={i + 6}
            />
          ) : (
            <span className="bg-bgdarker border border-muted rounded px-2 text-primarytext text-sm w-full flex items-center h-8 cursor-default">
              {seedPhrase ? seedPhrase[i + 6] : values[i + 6]}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default RecoveryPhraseGrid;
