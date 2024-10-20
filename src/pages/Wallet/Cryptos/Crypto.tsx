import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import ActionButton from '@/components/buttons/ActionButtons/ActionButton'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import CryptoBalance from '@/components/CryptoBalance'
import CryptoImage from '@/components/CryptoImage'

const Crypto: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = location.state || {}

  return (
    <>
      <AnimatedMain>
        <Header title={token.tick} showBackButton={true} />
        <CryptoImage ticker={token.tick} size={'large'} />
        <CryptoBalance token={token} />

        <div className="flex justify-center space-x-6 mt-4">
          <ActionButton
            icon={<ArrowUpIcon strokeWidth={2} />}
            label="Send"
            onClick={() => navigate('/send/crypto', { state: { token } })}
          />

          <ActionButton
            icon={<ArrowDownIcon strokeWidth={2} />}
            label="Receive"
            onClick={() => navigate('/receive')}
          />
        </div>
      </AnimatedMain>

      <BottomNav />
    </>
  )
}

export default Crypto
