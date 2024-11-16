import React, { useState } from 'react'
import ModalContainer from '@/components/containers/ModalContainer'
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
import NextButton from '@/components/buttons/NextButton'
import ErrorMessage from '@/components/messages/ErrorMessage'
import WarningMessage from '@/components/WarningMessage'

interface SlippageSettingsProps {
  onClose: () => void
  onSelectSlippage: (slippage: number) => void
  slippage: number
}

const slippageOptions: number[] = [0.5, 1, 1.5]

const SlippageSettings: React.FC<SlippageSettingsProps> = ({ onClose, onSelectSlippage, slippage }) => {
  const [_selectedSlippage, setSelectedSlippage] = useState<number>(slippage)
  const [customSlippage, setCustomSlippage] = useState<number | ''>('')
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('Custom')
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  const handleCustomSlippageChange = (value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      const parsedValue = parseFloat(value)
      setCustomSlippage(value === '' ? '' : parsedValue)

      if (parsedValue === 0) {
        setError('Slippage must be more than 0%')
        setWarning(null)
      } else if (parsedValue > 30) {
        setError('Slippage must be 30% or less')
        setWarning(null)
      } else if (parsedValue > 3) {
        setWarning('Your transaction may be frontrun and result in an unfavorable trade.')
        setError(null)
      } else {
        setError(null)
        setWarning(null)
      }
    }
  }

  const handleConfirm = () => {
    const slippage = isCustom ? customSlippage : _selectedSlippage
    if (isCustom && (customSlippage === '' || error)) return
    onSelectSlippage(slippage as number)
    onClose()
  }

  return (
    <ModalContainer title="Slippage Settings" onClose={onClose}>
      <div className="flex flex-col items-center justify-center space-y-4 pt-5">
        <AdjustmentsVerticalIcon className="h-14 w-14 text-muted" />

        <p className="text-justify text-base text-mutedtext">
          Your transaction will fail if the price changes more than the slippage. Too high of a value will
          result in an unfavorable trade.
        </p>

        <div className="grid grid-cols-4 w-full mt-4">
          {slippageOptions.map((option, index) => {
            const roundedClasses = index === 0 ? 'rounded-l-lg' : ''
            return (
              <button
                key={option}
                onClick={() => {
                  setSelectedSlippage(option)
                  setIsCustom(false)
                  setError(null)
                }}
                className={`w-full py-2 text-base ${roundedClasses} ${
                  _selectedSlippage === option && !isCustom
                    ? 'bg-primary text-secondarytext'
                    : 'bg-slightmuted text-primarytext'
                }`}
              >
                {`${option}%`}
              </button>
            )
          })}

          {/* Custom Slippage Option */}
          <div className="relative w-full rounded-r-lg">
            <input
              type="number"
              value={isCustom ? customSlippage : ''}
              onFocus={() => {
                setIsCustom(true)
                setSelectedSlippage(0)
                setInputPlaceholder('0.00%')
              }}
              onBlur={() => setInputPlaceholder('Custom')}
              onChange={(e) => handleCustomSlippageChange(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full py-2 px-2 text-base font-medium bg-slightmuted text-primarytext text-center focus:outline-none rounded-r-lg"
            />
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {warning && <WarningMessage message={warning} />}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <NextButton
          text="Confirm"
          onClick={handleConfirm}
          buttonEnabled={
            !error && (!isCustom || (customSlippage !== '' && customSlippage > 0 && customSlippage <= 30))
          }
        />
      </div>
    </ModalContainer>
  )
}

export default SlippageSettings
