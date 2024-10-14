import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'
import TokenDetails from '@/components/TokenDetails'
import { truncateAddress } from '@/utils/formatting'
import useKaspa from '@/hooks/useKaspa'

const ConfirmSendKRC20: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount } = location.state || {}
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { request } = useKaspa()
  const [script, setScript] = useState<string>()
  const [commitAddress, setCommitAddress] = useState<string>()

  const handleConfirmClick = useCallback(() => {
    request('account:writeInscription', [recipient, token.tick, amount, token.dec])
      .then((scriptAddress) => {
        console.log(
          '[ConfirmSendKRC20] account write inscription success. Returning scriptAddress:',
          scriptAddress,
        )
        setCommitAddress(scriptAddress)
      })
      .catch((err) => {
        setError(err.message || 'Error occurred transferring KRC20 token.')
        console.error('[ConfirmSendKRC20] error writing inscription:', err)
      })
  }, [request])

  const handleCancelClick = () => {
    navigate('/wallet')
  }

  // TODO: invoke transaction
  // const handleCommitment = useCallback(async () => {
  //   try {
  //     const commitment = await invoke('transact', [[[commitAddress!, '0.2']]])
  //     const transaction = JSON.parse(commitment)
  //     setCommit(transaction.id)
  //     toast.success('Committed token transfer request successfully!', {
  //       action: {
  //         label: 'Copy',
  //         onClick: () => navigator.clipboard.writeText(transaction.id),
  //       },
  //     })
  //   } catch (error) {
  //     toast.error(`Oops! Something went wrong with your wallet: ${error}`)
  //   }
  // }, [commitAddress, invoke])

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
              <span className="text-base font-lato text-primarytext">(fee placeholder)</span>
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

export default ConfirmSendKRC20
