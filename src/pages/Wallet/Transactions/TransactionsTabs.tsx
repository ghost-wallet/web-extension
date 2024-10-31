import React from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import KRC20TxnHistory from '@/pages/Wallet/Transactions/KRC20TxnHistory'
import KaspaTxnHistory from '@/pages/Wallet/Transactions/KaspaTxnHistory'

interface TransactionsTabsProps {}

const TransactionsTabs: React.FC<TransactionsTabsProps> = () => {
  const selectedClass = 'bg-primary text-secondarytext'

  const getTabClassName = (selected: boolean) =>
    `w-full py-2.5 text-base leading-5 ${selected ? selectedClass : 'text-primarytext hover:bg-slightmuted'}`

  return (
    <TabGroup>
      <TabList className="flex rounded-lg bg-darkmuted overflow-hidden">
        <Tab
          className={({ selected }) => `${getTabClassName(selected)} first:rounded-l-lg last:rounded-r-lg`}
        >
          Kaspa
        </Tab>
        <Tab
          className={({ selected }) => `${getTabClassName(selected)} first:rounded-l-lg last:rounded-r-lg`}
        >
          KRC20
        </Tab>
      </TabList>
      <TabPanels className="mt-4">
        <TabPanel>
          <KaspaTxnHistory />
        </TabPanel>
        <TabPanel>
          <KRC20TxnHistory />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}

export default TransactionsTabs
