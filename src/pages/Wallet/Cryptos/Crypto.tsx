import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import CryptoBalance from '@/components/CryptoBalance'
import CryptoPrice from '@/components/CryptoPrice'
import CryptoImage from '@/components/CryptoImage'
import CryptoActionButtons from '@/components/buttons/CryptoActionButtons'

const Crypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  return (
    <>
      <AnimatedMain>
        <Header title={token.tick} showBackButton={true} />
        <CryptoImage ticker={token.tick} size={'large'} />
        <CryptoActionButtons token={token} />
        <CryptoBalance token={token} />
        <CryptoPrice token={token} />
      </AnimatedMain>

      <BottomNav />
    </>
  )
}

export default Crypto
