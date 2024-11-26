import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import AnimatedMain from '@/components/AnimatedMain';
import BottomNav from '@/components/navigation/BottomNav';
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import LocalStorage from '@/storage/LocalStorage';

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState<{ accountName: string }[]>([]);
  const [isEditing, setIsEditing] = useState<{ [index: number]: boolean }>({}); // Track edit state per account

  useEffect(() => {
    // Fetch wallet and populate accounts
    const fetchAccounts = async () => {
      const wallet = await LocalStorage.get('wallet');
      console.log('wallet', wallet)
      if (wallet && wallet.accounts) {
        setAccounts(wallet.accounts);
      } else {
        console.warn('Wallet not found in local storage.');
      }
    };

    fetchAccounts();
  }, []);

  const handleEditClick = (index: number) => {
    setIsEditing((prev) => ({ ...prev, [index]: true }));
  };

  const handleSaveClick = async (index: number, newAccountName: string) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index].accountName = newAccountName || `Account ${index + 1}`;

    // Update wallet in local storage
    const wallet = await LocalStorage.get('wallet');
    if (wallet) {
      wallet.accounts = updatedAccounts;
      await LocalStorage.set('wallet', wallet);
      // Trigger storage event manually to notify other components
      window.localStorage.setItem('wallet', JSON.stringify(wallet));
    }

    setAccounts(updatedAccounts);
    setIsEditing((prev) => ({ ...prev, [index]: false }));
  };

  if (!accounts.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AnimatedMain className="pt-5">
        <Header title="Manage Accounts" showBackButton={true} />
        <div className="pt-8 px-4">
          <div className="text-center">
            <h1 className="text-primarytext text-xl rubik font-bold">Edit account names</h1>
          </div>
          <div className="mt-4 space-y-4">
            {accounts.map((account, index) => (
              <div key={index} className="flex items-center space-x-1 w-full">
                {isEditing[index] ? (
                  <div className="flex items-center space-x-1 w-full">
                    <input
                      type="text"
                      value={account.accountName}
                      onChange={(e) =>
                        setAccounts((prev) => {
                          const updated = [...prev];
                          updated[index].accountName = e.target.value;
                          return updated;
                        })
                      }
                      maxLength={100}
                      className="bg-transparent border-b border-primarytext text-primarytext text-lg outline-none w-full text-left"
                      autoFocus
                    />
                    <CheckIcon
                      className="h-7 w-7 text-primarytext cursor-pointer hover:text-primary"
                      onClick={() => handleSaveClick(index, accounts[index].accountName)}
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center space-x-1 w-full cursor-pointer"
                    onClick={() => handleEditClick(index)}
                  >
                    <p className="text-mutedtext text-lg w-full text-left break-words whitespace-normal hover:text-primarytext">
                      {account.accountName}
                    </p>
                    <PencilSquareIcon className="h-7 w-7 text-mutedtext cursor-pointer hover:text-primarytext" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  );
}
