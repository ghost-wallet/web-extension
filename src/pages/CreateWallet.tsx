import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from '@/pages/CreateWallet/Landing';
import Create from '@/pages/CreateWallet/Create';
import Password from '@/pages/CreateWallet/Password';
import Import from '@/pages/CreateWallet/Import';
import Confirm from '@/pages/CreateWallet/Confirm';
import useKaspa from '@/hooks/useKaspa';

export enum Tabs {
  Landing,
  Password,
  Create,
  Import,
  Confirm,
}

export default function CreateWallet() {
  const navigate = useNavigate();
  const { request } = useKaspa();

  const [tab, setTab] = useState(Tabs.Landing);
  const [sensitive, setsensitive] = useState('');
  const [flowType, setFlowType] = useState<'create' | 'import'>('create');

  const handleForward = (tab: Tabs, flowType?: 'create' | 'import') => {
    if (flowType) setFlowType(flowType);
    setTab(tab);
  };

  const handlePasswordSet = async (pw: string) => {
    setsensitive(pw);
    if (flowType === 'create') {
      const mnemonic = await request('wallet:create', [pw]);
      setsensitive(mnemonic);
      setTab(Tabs.Create);
    } else {
      setTab(Tabs.Import);
    }
  };

  const handleMnemonicSubmit = async (mnemonic: string) => {
    await request('wallet:import', [mnemonic, sensitive]);
    navigate('/wallet');
  };

  const handleConfirm = () => {
    setTab(Tabs.Confirm);
  };

  return {
    [Tabs.Landing]: (
      <Landing
        forward={handleForward}
      />
    ),
    [Tabs.Password]: (
      <Password
        onPasswordSet={handlePasswordSet}
      />
    ),
    [Tabs.Import]: (
      <Import
        onMnemonicsSubmit={handleMnemonicSubmit}
      />
    ),
    [Tabs.Create]: (
      <Create
        mnemonic={sensitive}
        onSaved={handleConfirm}
      />
    ),
    [Tabs.Confirm]: (
      <Confirm
        mnemonic={sensitive}
        onConfirmed={async () => {
          await handleMnemonicSubmit(sensitive);
        }}
      />
    ),
  }[tab];
}
