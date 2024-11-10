import { useEffect, useState } from 'react'
import LocalStorage from '@/storage/LocalStorage'

const useAccountName = () => {
  const [accountName, setAccountName] = useState<string | null>(null)

  useEffect(() => {
    const fetchWallet = async () => {
      const wallet = await LocalStorage.get('wallet')
      console.log('fetched wallet:', wallet)
      if (wallet) {
        setAccountName(wallet.accountName)
      } else {
        setAccountName('Account 1')
      }
    }
    fetchWallet()
  }, [])

  return accountName
}

export default useAccountName
