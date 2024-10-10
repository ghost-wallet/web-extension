import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedMain from '@/components/AnimatedMain';
import BottomNav from '@/components/BottomNav';
import BackButton from '@/components/BackButton';
import { formatBalance } from '@/utils/formatting';
import TokenDetails from '@/components/TokenDetails';
import useKaspa from '@/hooks/useKaspa';
import useURLParams from '@/hooks/useURLParams';
import { Input as KaspaInput } from "@/provider/protocol";

const SendCrypto: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = location.state || {};
  const { kaspa, request } = useKaspa();
  const [hash, params] = useURLParams();

  if (!token || !token.tick || !token.balance || !token.dec) {
    return <div>Token information is missing or incomplete.</div>;
  }

  const maxAmount = token.tick === 'KASPA' ? token.balance : formatBalance(token.balance, token.dec);
  const [inputs] = useState<KaspaInput[]>(JSON.parse(params.get('inputs')!) || []);
  const [outputs, setOutputs] = useState<[string, string][]>([['', '']]);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState<string[]>([]);
  const [feeRate, setFeeRate] = useState(1);
  const [fee] = useState(params.get('fee') ?? "0");

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs];
      newOutputs[0][0] = value;
      return newOutputs;
    });
    setError(''); // Clear error when user changes recipient
  };

  const handleAmountChangeNative = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs];
      newOutputs[0][1] = value;
      return newOutputs;
    });
    setError(''); // Clear error when user changes amount
  };

  const handleMaxClick = () => {
    const maxAmountStr = maxAmount.toString();
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs];
      newOutputs[0][1] = maxAmountStr;
      return newOutputs;
    });
    setError(''); // Clear error when max is clicked
  };

  const initiateSend = useCallback(() => {
    request('account:create', [outputs, feeRate, fee, inputs])
      .then((transactions) => {
        setTransactions(transactions);
        navigate('/send/crypto/confirm', {
          state: {
            token,
            recipient: outputs[0][0],
            amount: outputs[0][1],
          },
        });
      })
      .catch((err) => {
        console.error(`Error occurred: ${err}`);
        setError(err);
      });
  }, [outputs, token, navigate, request, feeRate, fee, inputs]);

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Send {token.tick}
          </h1>
          <div className="w-6" />
        </div>

        <TokenDetails token={token} />

        <div className="flex flex-col items-center space-y-4 p-4">
          <input
            type="text"
            value={outputs[0][0]}
            onChange={handleRecipientChange}
            placeholder="Recipient's Kaspa Address"
            className="w-full p-2 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
          />

          <div className="relative w-full">
            <input
              type="number"
              value={outputs[0][1]}
              onChange={handleAmountChangeNative}
              placeholder="Amount"
              className="w-full p-2 pr-20 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondarytext font-lato text-base bg-primary rounded-[10px] px-2 py-1"
            >
              MAX
            </button>
          </div>

          <div className="min-h-[24px] mt-1 flex items-center justify-center">
            {error && (
              <div className="text-base font-lato text-error">{error}</div>
            )}
          </div>
        </div>

        <div className="px-6 pt-6">
          <button
            type="button"
            onClick={initiateSend}
            className="w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] bg-primary text-secondarytext cursor-pointer hover:bg-hover"
          >
            Continue
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  );
};

export default SendCrypto;
