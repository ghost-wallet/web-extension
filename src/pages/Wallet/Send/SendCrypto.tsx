import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'
import { formatBalance } from '@/utils/formatting'
import TokenDetails from '@/components/TokenDetails'
import useKaspa from '@/hooks/useKaspa'
import useURLParams from '@/hooks/useURLParams'
import { Input as KaspaInput } from '@/provider/protocol'

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = location.state || {}
  const { request } = useKaspa()
  const [hash, params] = useURLParams()

  // Check for missing or incomplete token information
  if (!token || !token.tick || !token.balance || !token.dec) {
    return <div>Token information is missing or incomplete.</div>
  }

  // Calculate max amount based on token type
  const maxAmount = token.tick === 'KASPA' ? token.balance : formatBalance(token.balance, token.dec)

  // State management
  const [inputs] = useState<KaspaInput[]>(
    params.get('inputs') ? JSON.parse(params.get('inputs')!) : [],
  )
  console.log('Inputs in SendCrypto.tsx:', inputs)
  const [outputs, setOutputs] = useState<[string, string][]>([['', '']])
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<string[]>([])
  const [feeRate, setFeerate] = useState(1)
  const [fee] = useState(params.get('fee') ?? '0')

  useEffect(() => {
    // Fetch the standard fee rate when the component loads
    request('node:priorityBuckets', [])
      .then((buckets) => setFeerate(buckets.standard.feeRate))
      .catch((err) => {
        console.error('Error fetching standard fee rate:', err)
        setError('Failed to retrieve the fee rate.')
      })
  }, [request])

  const validateRecipient = async (address: string) => {
    try {
      const isValid = await request('wallet:validate', [address])
      setError(isValid ? null : 'Invalid Kaspa address')
    } catch (err) {
      console.error('Error validating address:', err)
      setError('Error validating address.')
    }
  }

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][0] = value
      return newOutputs
    })

    if (token.tick !== 'KASPA') {
      validateRecipient(value)
    } else {
      setError(null) // Clear error if it's KASPA as validation isn't needed
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][1] = value
      return newOutputs
    })

    if (token.tick !== 'KASPA') {
      const numericValue = parseFloat(value)
      const formattedBalance = parseFloat(formatBalance(token.balance, token.dec))

      if (isNaN(numericValue) || numericValue <= 0 || numericValue > formattedBalance) {
        setError('Amount must be greater than 0 and within available balance.')
      } else {
        setError(null)
      }
    } else {
      setError(null) // No validation for KASPA amount, reset any errors
    }
  }

  const handleMaxClick = () => {
    const maxAmountStr = maxAmount.toString()
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][1] = maxAmountStr
      return newOutputs
    })
    setError(null)
  }

  const initiateSend = useCallback(() => {
    if (token.tick === 'KASPA') {
      // Only make the account:create request for KASPA tokens
      if (!feeRate) return

      request('account:create', [outputs, feeRate, fee, inputs])
        .then((transactions) => {
          setTransactions(transactions)
          navigate('/send/crypto/confirm', {
            state: {
              token,
              recipient: outputs[0][0],
              amount: outputs[0][1],
              transactions,
              inputs, // Pass the inputs state
            },
          })
        })
        .catch((err) => {
          console.error(`Error occurred: ${err}`)
          setError(`Error occurred: ${err.message}`)
        })
    } else {
      // Navigate directly for non-KASPA tokens
      navigate('/send/crypto/confirm', {
        state: {
          token,
          recipient: outputs[0][0],
          amount: outputs[0][1],
        },
      })
    }
  }, [outputs, token, navigate, request, feeRate, fee, inputs])

  const isButtonEnabled = outputs[0][0].length > 0 && outputs[0][1].length > 0 && !error

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Send {token.tick}
          </h1>
          <div className="w-6" />
        </div>

        <TokenDetails token={token} />
        <div className="text-primarytext text-center p-2">
          <p className="text-lg font-lato">Balance</p>
          <p className="text-xl font-lato">{maxAmount}</p>
        </div>

        <div className="flex flex-col items-center space-y-4 p-4">
          <input
            type="text"
            value={outputs[0][0]}
            onChange={handleRecipientChange}
            placeholder="Recipient's Kaspa Address"
            className="w-full p-2 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
          />

          <div className="relative w-full">
            <input
              type="number"
              value={outputs[0][1]}
              onChange={handleAmountChange}
              placeholder="Amount"
              className="w-full p-2 pr-20 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondarytext font-lato text-base bg-primary rounded-[10px] px-2 py-1"
            >
              MAX
            </button>
          </div>

          <div className="min-h-[24px] mt-1 flex items-center justify-center">
            {error && <div className="text-base font-lato text-error">{error}</div>}
          </div>
        </div>

        <div className="px-6 pt-6">
          <button
            type="button"
            onClick={initiateSend}
            disabled={!isButtonEnabled}
            className={`w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] ${
              isButtonEnabled
                ? 'bg-primary cursor-pointer hover:bg-hover'
                : 'bg-secondary cursor-not-allowed'
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
