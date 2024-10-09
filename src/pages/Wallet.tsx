import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/wallet/kaspa/wallet'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import ActionButtons from '@/components/ActionButtons'
import KRC20Tokens from '@/components/KRC20Tokens'
import KaspaBalance from '@/pages/Wallet/KaspaBalance'

export default function Wallet() {
  const { kaspa, request } = useKaspa()
  const { settings } = useSettings()
  const navigate = useNavigate()

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
          <div className="sticky top-0 bg-[var(--color-bg-dark)] w-full flex flex-col items-center p-4 border-b border-muted">
            <KaspaBalance />
            <ActionButtons />
            <h2 className="text-2xl text-primarytext font-lato text-left w-full">
              KRC20 Tokens
            </h2>
          </div>
          <KRC20Tokens />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
