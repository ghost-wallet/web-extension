import React from 'react'
import SwitchChaingeTokens from '@/pages/Wallet/Swap/SwitchChaingeTokens'

interface TokenSwitchProps {
  onSwitch: () => void
}

const TokenSwitch: React.FC<TokenSwitchProps> = ({ onSwitch }) => {
  return <SwitchChaingeTokens onSwitch={onSwitch} />
}

export default TokenSwitch
