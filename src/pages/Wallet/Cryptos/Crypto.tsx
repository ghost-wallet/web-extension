import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import { formatBalance } from '@/utils/formatting'
import BottomNav from '@/components/BottomNav'
import kaspaSvg from '@/../assets/kaspa-kas-logo.svg'

const Crypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  if (!token) {
    return <div>No token information available</div>
  }

  const { tick, balance, dec } = token

  const formattedBalance = tick === 'KASPA' ? balance : formatBalance(balance, dec)

  return (
    <>
      <AnimatedMain>
        <Header title={tick} showBackButton={true} />

        <div className="flex justify-center mt-4">
          <img
            src={tick === 'KASPA' ? kaspaSvg : `https://krc20-assets.kas.fyi/icons/${tick}.jpg`}
            alt={`${tick} logo`}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        <div className="text-primarytext text-center p-2 mt-4">
          <p className="text-lg font-lato">Balance</p>
          <p className="text-xl font-lato">{formattedBalance}</p>
        </div>
      </AnimatedMain>

      <BottomNav />
    </>
  )
}

export default Crypto
