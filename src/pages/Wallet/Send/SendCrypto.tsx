import React, { useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import { formatBalance } from '@/utils/formatting'
import CryptoImage from '@/components/CryptoImage'
import useKaspa from '@/hooks/useKaspa'
import useURLParams from '@/hooks/useURLParams'
import { Input as KaspaInput } from '@/provider/protocol'
import { validateRecipient, validateAmountToSend } from '@/utils/validation'
import { useFeeRate } from '@/hooks/useFeeRate'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = location.state || {}
  const { request } = useKaspa()
  const [hash, params] = useURLParams()

  const maxAmount = token.tick === 'KASPA' ? token.balance : formatBalance(token.balance, token.dec)

  const [inputs] = useState<KaspaInput[]>(params.get('inputs') ? JSON.parse(params.get('inputs')!) : [])
  const [outputs, setOutputs] = useState<[string, string][]>([['', '']])
  const [recipientError, setRecipientError] = useState<string | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)
  const [fee] = useState(params.get('fee') ?? '0')

  const { feeRate, error: feeRateError } = useFeeRate()

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][0] = value
      return newOutputs
    })

    if (token.tick !== 'KASPA') {
      validateRecipient(request, value, setRecipientError)
    } else {
      setRecipientError(null)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    const decimalPlaces = value.split('.')[1]?.length || 0
    if (decimalPlaces > token.dec) {
      return // Don't update the state if the user exceeds the allowed decimal places
    }

    if (value.startsWith('.') && value.length > 1) {
      value = `0${value}`
    }

    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][1] = value
      return newOutputs
    })

    validateAmountToSend(token.tick, value, parseFloat(maxAmount), setAmountError)
  }

  const handleMaxClick = () => {
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][1] = maxAmount.toString()
      return newOutputs
    })
    setAmountError(null)
  }

  const initiateSend = useCallback(() => {
    if (!feeRate) return
    request('account:create', [outputs, feeRate, fee, inputs])
      .then(([transactions, fee]) => {
        navigate(`/send/${token.tick}/confirm`, {
          state: {
            token,
            recipient: outputs[0][0],
            amount: outputs[0][1],
            transactions,
            inputs,
          },
        })
      })
      .catch((err) => {
        console.error(`Error occurred: ${err}`)
        setRecipientError(`Error: ${err}`)
      })
  }, [outputs, token, navigate, request, feeRate, fee, inputs])

  const handleContinue = () => {
    console.log('handling continue with token', token.tick)
    if (token.tick === 'KASPA') {
      initiateSend()
    } else {
      navigate(`/send/${token.tick}/confirmkrc20`, {
        state: {
          token,
          recipient: outputs[0][0],
          amount: outputs[0][1],
          feeRate: feeRate,
        },
      })
    }
  }

  const isButtonEnabled =
    outputs[0][0].length > 0 && outputs[0][1].length > 0 && !recipientError && !amountError

  const formattedBalance =
    token.tick === 'KASPA'
      ? parseFloat(token.balance).toLocaleString(undefined, {
          minimumFractionDigits: parseFloat(token.balance) % 1 === 0 ? 0 : 2, // Show 0 decimals for whole numbers
          maximumFractionDigits: 8, // Up to 8 decimal places for non-integer values
        })
      : parseFloat(String(formatBalance(token.balance, token.dec))).toLocaleString(undefined, {
          minimumFractionDigits:
            parseFloat(String(formatBalance(token.balance, token.dec))) % 1 === 0 ? 0 : 2, // Show 0 decimals for whole numbers
          maximumFractionDigits: 8, // Up to 8 decimal places for non-integer values
        })

  return (
    <>
      <AnimatedMain>
        <Header title={`Send ${token.tick}`} showBackButton={true} />
        <CryptoImage ticker={token.tick} size={'large'} />

        <div className="flex flex-col items-center space-y-4 p-4">
          <input
            type="text"
            value={outputs[0][0]}
            onChange={handleRecipientChange}
            placeholder="Recipient's Kaspa address"
            className="w-full p-3 border border-slightmuted bg-bgdarker text-base text-primarytext placeholder-mutedtext rounded"
          />

          <div className="relative w-full">
            <input
              type="number"
              value={outputs[0][1]}
              onChange={handleAmountChange}
              placeholder="Amount"
              className="w-full p-3 pr-20 border border-slightmuted bg-bgdarker text-base text-primarytext placeholder-mutedtext rounded"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primarytext font-lato text-base bg-slightmuted hover:bg-muted rounded-[10px] px-2 py-1"
            >
              Max
            </button>
          </div>

          <div className="w-full text-right text-mutedtext font-lato font-light text-base">
            Available {formattedBalance} {token.tick}
          </div>

          <ErrorMessage message={recipientError || amountError || ''} />
        </div>

        <div className="px-6 pt-6">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isButtonEnabled}
            className={`w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] ${
              isButtonEnabled ? 'bg-primary cursor-pointer hover:bg-hover' : 'bg-secondary cursor-not-allowed'
            } text-secondarytext`}
          >
            Continue
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default SendCrypto
