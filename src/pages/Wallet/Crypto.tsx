import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import CryptoImage from '@/components/cryptos/CryptoImage'
import ActionButtons from '@/pages/Wallet/Crypto/ActionButtons'
import Details from '@/pages/Wallet/Crypto/Details'

const Crypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  return (
    <>
      <AnimatedMain>
        <Header title={token.tick} showBackButton={true} />
        <CryptoImage ticker={token.tick} size={'large'} />
        <ActionButtons token={token} />
        <Details token={token} />
      </AnimatedMain>

      <BottomNav />
    </>
  )
}

export default Crypto
