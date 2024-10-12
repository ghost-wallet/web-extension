import React, { useMemo, useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'
import TokenDetails from '@/components/TokenDetails'
import useKaspa from '@/hooks/useKaspa'

const ConfirmSend: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, transactions, inputs } = location.state || {}
  console.log('Inputs received in ConfirmSend:', inputs)
  const { request } = useKaspa()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check for missing or incomplete information based on token type
  if (!token || !recipient || !amount || (token.tick === 'KASPA' && !transactions)) {
    return <div>Transaction information is missing or incomplete.</div>
  }

  // Utility function to truncate the recipient address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-4)}`
  }

  // Calculate fee only if the token is KASPA
  const fee = useMemo(() => {
    if (token.tick !== 'KASPA' || !transactions) return 0

    try {
      const transaction = JSON.parse(transactions[transactions.length - 1])
      const inputValue = transaction.inputs.reduce((acc: bigint, input: any) => {
        return acc + BigInt(input.utxo!.amount)
      }, 0n)

      const outputValue = transaction.outputs.reduce((acc: bigint, output: any) => {
        return acc + BigInt(output.value)
      }, 0n)

      return Number(inputValue - outputValue) / 1e8 // Convert from smallest unit
    } catch (error) {
      console.error('Error calculating fee:', error)
      return 0 // Return 0 as a fallback
    }
  }, [transactions, token.tick])

  const handleConfirmClick = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      if (!Array.isArray(transactions)) {
        throw new Error('Transactions data is invalid')
      }

      // Step 1: Sign the transaction (without a password)
      console.log('Attempting to account:sign with transactions', transactions)
      const signedTransactions = await request('account:sign', [transactions])
      console.log('Transaction signed:', signedTransactions)

      console.log('Signed transaction', signedTransactions)

      // Step 2: Submit the transaction
      await request('account:submitContextful', [signedTransactions])
      console.log('Transaction submitted successfully')

      // Navigate to the Sent page and pass the props
      navigate('/send/crypto/confirm/sent', {
        state: {
          token,
          amount,
          recipient,
        },
      })
    } catch (err) {
      console.error('Error during transaction confirmation:', err)
      setError('Failed to confirm and submit transaction.')
    } finally {
      setLoading(false)
    }
  }, [request, transactions, navigate, token, amount, recipient])

  const handleCancelClick = () => {
    navigate('/wallet')
  }

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Confirm Send
          </h1>
          <div className="w-6" />
        </div>

        <TokenDetails token={token} />
        <div className="text-primarytext text-center p-2">
          <p className="text-lg font-lato">
            {amount} {token.tick}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-bgdarker rounded-md p-4">
            <div className="flex justify-between">
              <span className="text-base font-lato text-mutedtext">To</span>
              <span className="text-base font-lato text-primarytext">
                {truncateAddress(recipient)}
              </span>
            </div>
          </div>

          <div className="bg-bgdarker rounded-md p-4">
            <div className="flex justify-between">
              <span className="text-base font-lato text-mutedtext">Network</span>
              <span className="text-base font-lato text-primarytext">Mainnet</span>
            </div>
          </div>

          <div className="bg-bgdarker rounded-md p-4">
            <div className="flex justify-between">
              <span className="text-base font-lato text-mutedtext">Network Fee</span>
              <span className="text-base font-lato text-primarytext">
                {fee} {token.tick === 'KASPA' ? 'KAS' : ''}
              </span>
            </div>
          </div>

          {error && <div className="text-error mt-2">{error}</div>}

          <div className="flex gap-[6px] mt-6">
            <button
              onClick={handleCancelClick}
              className="flex-1 bg-muted text-primarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClick}
              disabled={loading}
              className="flex-1 bg-primary text-secondarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6"
            >
              {loading ? 'Processing...' : 'Send'}
            </button>
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default ConfirmSend
