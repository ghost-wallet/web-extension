import { useEffect, useState, useMemo } from 'react'
import LocalStorage from '@/storage/LocalStorage'

const useAccountName = () => {
  const initialAccountName = useMemo(() => {
    const storedWallet = localStorage.getItem('wallet')
    if (storedWallet) {
      const wallet = JSON.parse(storedWallet)
      return wallet.accountName || 'Account 1'
    }
    return 'Account 1'
  }, [])

  const [accountName, setAccountName] = useState<string>(initialAccountName)

  useEffect(() => {
    const fetchWallet = async () => {
      const wallet = await LocalStorage.get('wallet')
      if (wallet) {
        const name = wallet.accountName || 'Account 1'
        setAccountName(name)
      }
    }

    // Only fetch if accountName is not initialized
    if (accountName === 'Account 1' && !localStorage.getItem('wallet')) {
      fetchWallet()
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wallet' && event.newValue) {
        const updatedWallet = JSON.parse(event.newValue)
        setAccountName(updatedWallet.accountName || 'Account 1')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [accountName])

  return accountName
}

export default useAccountName
