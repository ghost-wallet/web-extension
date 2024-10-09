import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/wallet/kaspa/wallet'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import ActionButtons from '@/components/ActionButtons'
import KRC20Tokens from '@/components/KRC20Tokens'

export default function Wallet() {
  const { kaspa, request } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)
  const navigate = useNavigate()

  console.log('Initial kaspa addresses:', JSON.stringify(kaspa.addresses))

  useEffect(() => {
    if (!kaspa.connected) {
      console.warn('Kaspa is not connected. Attempting to connect...')
      request('node:connect', [settings.nodes[settings.selectedNode].address])
        .then(() => {
          console.log('Successfully connected to the node.')
        })
        .catch((error) => {
          console.error('Error connecting to node:', error)
        })
    }

    if (kaspa.status !== Status.Unlocked) {
      navigate('/')
    }
  }, [kaspa.status])

  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col items-center">
          <p className="text-3xl font-rubik text-primarytext">
            {kaspa.balance !== null && kaspa.balance !== undefined
              ? `${kaspa.balance.toFixed(2)} KAS`
              : 'Loading...'}
          </p>
          <p className="text-xl font-rubik text-primarytext">
            {settings.currency === 'USD'
              ? '$'
              : settings.currency === 'EUR'
                ? '€'
                : settings.currency}{' '}
            {(kaspa.balance * price).toFixed(2)}
          </p>

          <ActionButtons />

          <KRC20Tokens />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
