import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from '@/pages/CreateWallet/Landing';
import Create from '@/pages/CreateWallet/Create';
import Password from '@/pages/CreateWallet/Password';
import Import from '@/pages/CreateWallet/Import';
import useKaspa from '@/hooks/useKaspa';

export enum Tabs {
  Landing,
  Password,
  Create,
  Import,
}

export default function CreateWallet() {
  const navigate = useNavigate();
  const { request } = useKaspa();

  const [tab, setTab] = useState(Tabs.Landing);
  const [sensitive, setSensitive] = useState('');
  const [flowType, setFlowType] = useState<'create' | 'import'>('create');

  const handleForward = (tab: Tabs, flowType?: 'create' | 'import') => {
    if (flowType) setFlowType(flowType);
    setTab(tab);
  };

  const handlePasswordSet = async (password: string) => {
    setSensitive(password);
    if (flowType === 'create') {
      const mnemonic = await request('wallet:create', [password]);
      setSensitive(mnemonic);
      setTab(Tabs.Create);
    } else {
      setTab(Tabs.Import);
    }
  };

  const handleMnemonicSubmit = async (mnemonic: string) => {
    await request('wallet:import', [mnemonic, sensitive]);
    navigate('/wallet');
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
        onSaved={() => navigate('/wallet')}
      />
    ),
  }[tab];
}
