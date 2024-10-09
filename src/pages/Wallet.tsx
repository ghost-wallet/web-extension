import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'
import { Status } from '@/wallet/kaspa/wallet'
import BottomNav from '@/components/BottomNav'
import QRCode from 'react-qr-code'

export default function Wallet() {
  const { kaspa, request } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)
  const navigate = useNavigate()
  console.log('kaspa addresses in Wallet', kaspa.addresses)

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
      <motion.main
        className="pt-10 px-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center">
          <p className="text-3xl font-rubik text-primarytext">
            {kaspa.balance.toFixed(4)} KAS
          </p>
          <p className="text-xl font-rubik text-primarytext">
            {settings.currency === 'USD'
              ? '$'
              : settings.currency === 'EUR'
                ? '€'
                : settings.currency}{' '}
            {(kaspa.balance * price).toFixed(2)}
          </p>

          <div className="flex flex-col items-center">
            <textarea
              readOnly
              value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
              className="w-72 border-none resize-none text-mutedtext bg-transparent"
            />
          </div>

          <div className="flex flex-col items-center mt-4">
            <QRCode
              style={{ height: 'auto', width: '35%' }}
              value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
            />
          </div>
        </div>
      </motion.main>
      <BottomNav />
    </>
  )
}
