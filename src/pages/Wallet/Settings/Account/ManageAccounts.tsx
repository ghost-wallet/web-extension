import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import useAccountName from '@/hooks/wallet/useAccountName'
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline'
import LocalStorage from '@/storage/LocalStorage'
import useSettings from '@/hooks/contexts/useSettings'

export default function ManageAccounts() {
  const { settings } = useSettings()
  const currentAccountName = useAccountName()
  const [accountName, setAccountName] = useState<string | null>(currentAccountName)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (currentAccountName !== null) {
      setAccountName(currentAccountName)
    }
  }, [currentAccountName])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    setIsEditing(false)
    const wallet = await LocalStorage.get('walletV2')
    if (wallet) {
      wallet.accounts[settings.activeAccount].name = accountName || 'Account 1'
      await LocalStorage.set('walletV2', wallet)
      // Trigger storage event manually to notify other components
      window.localStorage.setItem('walletV2', JSON.stringify(wallet))
    } else {
      console.warn('Wallet not found in local storage.')
    }
  }

  if (accountName === null) {
    return <div>Loading...</div>
  }

  return (
    <>
      <AnimatedMain className="pt-5">
        <Header title="Manage Accounts" showBackButton={true} />
        <div className="pt-8 px-4">
          <div className="text-center">
            <h1 className="text-primarytext text-xl rubik font-bold">Edit account name</h1>
          </div>
          <div className="mt-4">
            {isEditing ? (
              <div className="flex items-center space-x-1 w-full">
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  maxLength={100}
                  className="bg-transparent border-b border-primarytext text-primarytext text-lg outline-none w-full text-left"
                  autoFocus
                />
                <CheckIcon
                  className="h-7 w-7 text-primarytext cursor-pointer hover:text-primary"
                  onClick={handleSaveClick}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-1 w-full cursor-pointer" onClick={handleEditClick}>
                <p className="text-mutedtext text-lg w-full text-left break-words whitespace-normal hover:text-primarytext">
                  {accountName}
                </p>
                <PencilSquareIcon className="h-7 w-7 text-mutedtext cursor-pointer hover:text-primarytext" />
              </div>
            )}
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
