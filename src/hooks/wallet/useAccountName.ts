import { useEffect, useState, useMemo } from 'react'
import LocalStorage from '@/storage/LocalStorage'
import useSettings from '@/hooks/contexts/useSettings'

const useAccountName = () => {
  const { settings } = useSettings()
  const initialAccountName = useMemo(() => {
    const storedWallet = localStorage.getItem('walletV2')
    if (storedWallet) {
      const wallet = JSON.parse(storedWallet)
      return wallet.accounts[settings.activeAccount].name || 'Account 1'
    }
    return 'Account 1'
  }, [])

  const [accountName, setAccountName] = useState<string>(initialAccountName)

  useEffect(() => {
    const fetchWallet = async () => {
      const wallet = await LocalStorage.get('walletV2')
      console.log('wallet', wallet)
      if (wallet) {
        const name = wallet.accounts[settings.activeAccount].name || 'Account 1'
        setAccountName(name)
      }
    }

    // Only fetch if accountName is not initialized
    if (accountName === 'Account 1' && !localStorage.getItem('walletV2')) {
      fetchWallet()
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'walletV2' && event.newValue) {
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
