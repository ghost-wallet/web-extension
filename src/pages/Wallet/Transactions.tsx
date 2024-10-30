import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import TransactionsHistory from '@/pages/Wallet/Transactions/TransactionsHistory'
import BottomNav from '@/components/BottomNav'

interface TransactionsProps {
  tick?: string
}

export default function Transactions({ tick }: TransactionsProps) {
  return (
    <AnimatedMain>
      <Header title="KRC20 Recent Activity" showBackButton={false} />
      <div className="px-4">
        <TransactionsHistory tick={tick} />
      </div>
      <BottomNav />
    </AnimatedMain>
  )
}
