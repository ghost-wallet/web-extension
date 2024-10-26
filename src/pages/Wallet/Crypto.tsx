import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import CryptoImage from '@/components/cryptos/CryptoImage'
import CryptoActionButtons from '@/pages/Wallet/Crypto/CryptoActionButtons'
import CryptoDetails from '@/pages/Wallet/Crypto/CryptoDetails'

const Crypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  return (
    <>
      <AnimatedMain>
        <Header title={token.tick} showBackButton={true} />
        <CryptoImage ticker={token.tick} size={'large'} />
        <CryptoActionButtons token={token} />
        <CryptoDetails token={token} />
      </AnimatedMain>

      <BottomNav />
    </>
  )
}

export default Crypto
