import React, { useMemo, useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'
import TokenDetails from '@/components/TokenDetails'
import { truncateAddress } from '@/utils/formatting'
import { Inscription } from 'kasplexbuilder'
import * as kaspa from '../../../wasm'
import kapsajs_wasm from '../../../wasm/kaspa.js?url'
import kapsabg_wasm from '../../../wasm/kaspa_bg.wasm?url'

const ConfirmSendKRC20: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount } = location.state || {}
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirmClick = () => {
    console.log('[ConfirmSendKRC20] Confirm clicked!')
    console.log("[ConfirmSendKRC20] WASM js Path ", kapsajs_wasm);
    console.log("[ConfirmSendKRC20] WASM bg Path ", kapsabg_wasm);
    kaspa.default(kapsabg_wasm).then(r => console.log('[ConfirmSendKRC20] default success! ', r.toString()));
    const script = new kaspa.ScriptBuilder();
    console.log('[ConfirmSendKRC20] ScriptBuilder success! ', script)
    const address = new kaspa.Address("kaspa:qqf8sr34pz5u4rvwfru8842yknfp2d2nwv2acyww2dtd6jr30dk6yfhhnn3x7")
    console.log('[ConfirmSendKRC20] Address success! ', address)
    const publicKey = kaspa.XOnlyPublicKey.fromAddress(address).toString()
    console.log('[ConfirmSendKRC20] XOnlyPublicKey success! ', publicKey)
    const inscription = new Inscription(
      'transfer', {
        tick: token.tick,
        amt: BigInt(+amount * (10 ** +token.dec)).toString(),
        to: recipient,
      })
    console.log('[ConfirmSendKRC20] Inscription success! ', inscription)
    inscription.write(script, publicKey)
    console.log('[ConfirmSendKRC20] Inscription.write success! ', inscription)
    const scriptAddress = kaspa.addressFromScriptPublicKey(script.createPayToScriptHashScript(), 'mainnet')!.toString()
    console.log('[ConfirmSendKRC20] addressFromScriptPublicKey success! ', inscription)
    const commitment = localStorage.getItem(scriptAddress)
    console.log('[ConfirmSendKRC20] locaStorage.get success! ', commitment)

  }

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
