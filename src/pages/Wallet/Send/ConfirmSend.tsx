import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import useKaspa from '@/hooks/useKaspa'
import BackButton from '@/components/BackButton'

const ConfirmSend: React.FC = () => {
  const location = useLocation()
  const { token, recipient, amount, transactions } = location.state || {}

  if (!token || !recipient || !amount || !transactions) {
    return <div>Transaction information is missing or incomplete.</div>
  }

  const { kaspa } = useKaspa()

  // Calculate the fee using useMemo
  const fee = useMemo(() => {
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
  }, [transactions])

  const handleConfirmClick = () => {
    // Logic to confirm the transaction
    console.log('Transaction confirmed:', { token, recipient, amount })
  }

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Confirm Send
          </h1>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Amount</h3>
            <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold">
              {amount} {token.tick}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold">Recipient</h3>
            <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold">
              {recipient}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold">Fee</h3>
            <p className="bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold">
              {fee} KAS
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleConfirmClick}
            className="bg-primary text-secondarytext font-semibold py-2 px-6 rounded-full hover:bg-hover cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default ConfirmSend
