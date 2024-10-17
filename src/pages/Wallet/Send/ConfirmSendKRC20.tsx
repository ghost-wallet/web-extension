import React, { useCallback, useEffect, useState } from 'react'
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

  useEffect(() => {
    request('account:writeInscription', [recipient, token.tick, amount, token.dec])
      .then((response) => {
        console.log('[ConfirmSendKRC20] write inscription success. Response:', response)
        const [scriptString, scriptAddress] = response
        console.log('[ConfirmSendKRC20] scriptString ', scriptString)
        console.log('[ConfirmSendKRC20] scriptAddress ', scriptAddress)

        setCommitAddress(scriptAddress)
        setScript(scriptString)
      })
      .catch((err) => {
        setError(err.message || 'Error occurred transferring KRC20 token.')
        console.error('[ConfirmSendKRC20] error writing inscription:', err)
      })
  }, [request, recipient, token.tick, amount, token.dec])
  
  // Add this new useEffect to log the updated state
  useEffect(() => {
    console.log('[ConfirmSendKRC20] Updated commitAddress:', commitAddress)
  }, [commitAddress])
  
  useEffect(() => {
    console.log('[ConfirmSendKRC20] Updated script:', script)
  }, [script])

  const handleConfirmClick = useCallback(async () => {
    if (!script || !commitAddress) {
      console.error('[ConfirmSendKRC20] Script or commit address is missing')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('[ConfirmSendKRC20] Attempting to invoke KRC-20 transfer:')
      console.log('[ConfirmSendKRC20] Commit Address:', commitAddress)
      console.log('[ConfirmSendKRC20] Script:', script)

      const invokeRequest = {
        method: 'transfer',
        params: {
          recipient: recipient,
          amount: amount,
          ticker: token.tick,
          script: script,
          commitAddress: commitAddress
        }
      }
      console.log('[ConfirmSendKRC20] invokeRequest ',  invokeRequest)
      // Use kaspa:invoke to create the transaction
      // const invokeResponse = await request('kaspa:invoke', invokeRequest)
      // console.log('[ConfirmSendKRC20] KRC-20 transfer invoked:', invokeResponse)
      //
      // setError('[ConfirmSendKRC20] KRC-20 transfer prepared successfully. Check console for details.')
    } catch (err) {
      console.error('[ConfirmSendKRC20] Error during KRC-20 transfer process:', err)
      // @ts-ignore
      setError(err.message || '[ConfirmSendKRC20] An error occurred while processing the KRC-20 transfer.')
    } finally {
      setLoading(false)
    }
  }, [script, commitAddress, request, recipient, amount, token])

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
              disabled={loading || !commitAddress}
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
