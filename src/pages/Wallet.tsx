import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/wallet/kaspa/wallet'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import QRCode from 'react-qr-code'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

export default function Wallet() {
  const { kaspa, request } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)
  const navigate = useNavigate()
  console.log('kaspa addresses', JSON.stringify(kaspa.addresses))

  useEffect(() => {
    if (!kaspa.connected) {
      request('node:connect', [settings.nodes[settings.selectedNode].address])
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

          <div className="my-4 flex justify-between gap-8">
            <button className="flex flex-col items-center justify-center group">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-1 transition group-hover:bg-secondary">
                <ArrowUpIcon className="h-6 w-6 text-secondarytext" />
              </div>
              <span className="text-primarytext text-base font-lato transition group-hover:text-mutedtext">
                Send
              </span>
            </button>
            <button className="flex flex-col items-center justify-center group">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-1 transition group-hover:bg-secondary">
                <ArrowDownIcon className="h-6 w-6 text-secondarytext" />
              </div>
              <span className="text-primarytext text-base font-lato transition group-hover:text-mutedtext">
                Receive
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <textarea
              readOnly
              value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
              className="w-72 border-none resize-none text-mutedtext bg-transparent"
            />
          </div>

          <div className="flex flex-col items-center mt-4">
            <QRCode
              style={{ height: 'auto', width: '50%' }}
              value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
            />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
