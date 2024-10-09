import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useKaspa from '@/hooks/useKaspa';
import useSettings from '@/hooks/useSettings';
import useCoingecko from '@/hooks/useCoingecko';
import { Status } from '@/wallet/kaspa/wallet';
import BottomNav from '@/components/BottomNav';
import QRCode from 'react-qr-code'

export default function Wallet() {
  const { kaspa, request } = useKaspa();
  const { settings } = useSettings();
  const price = useCoingecko(settings.currency);
  const navigate = useNavigate();
  console.log('kaspa addresses in Wallet', kaspa.addresses)

  useEffect(() => {
    if (!kaspa.connected) {
      request('node:connect', [settings.nodes[settings.selectedNode].address]);
    }

    if (kaspa.status !== Status.Unlocked) {
      navigate('/');
    }
  }, [kaspa.status]);

  return (
    <main className="p-6 pb-20">
      <div className="flex flex-col gap-1 mt-4">
        <div className="flex flex-col items-center">
          <p className="text-4xl font-rubik text-primarytext">
            {kaspa.balance.toFixed(4)} KAS
          </p>
          <p className="text-xl font-rubik text-mutedtext">
            {settings.currency} {(kaspa.balance * price).toFixed(2)}
          </p>
        </div>



        <div className="flex flex-col items-center">
          <textarea
            readOnly
            value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
            className="w-72 border-none resize-none text-mutedtext bg-transparent"
          />
        </div>

        <div className="flex flex-col items-center mt-4">
          <QRCode
            style={{ height: 'auto', width: '35%' }}
            value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
          />
        </div>



      </div>
      <BottomNav />
    </main>
  );
}
