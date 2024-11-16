import { MINT_PER_TXN, MINT_SERVER_START_TIME } from '@/utils/constants/constants'

export const MESSAGES = {
  CHAINGE_UNAVAILABLE: (ticker: string) =>
    `${ticker} is not yet supported for swapping in Ghost wallet. <br/><br/>Enable swapping by adding liquidity to <a href="https://krc20.chainge.finance/" target="_blank" rel="noopener noreferrer" class="text-primary text-base hover:underline">Chainge</a>. <br/><br/>Alternatively, you can trade ${ticker} on <a href="https://t.me/kspr_home_bot?start=ZhFz4g" target="_blank" rel="noopener noreferrer" class="text-primary text-base hover:underline">KSPR Bot</a>.`,

  MINT_SUCCESS: (payAmount: number, scriptAddress: string) => {
    console.log('receive amount, msst, mpt', payAmount, MINT_SERVER_START_TIME, MINT_PER_TXN)
    const estimatedTime = ((MINT_SERVER_START_TIME + MINT_PER_TXN * payAmount) / 60).toFixed(2)
    return `Estimated time until completion: ${estimatedTime} minutes. <br/><br/>
    Every mint will automatically appear in your wallet. Track minting progress on the
    <a href="${scriptAddress}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
      Kaspa Explorer
    </a>.`
  },
}
