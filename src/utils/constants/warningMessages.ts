export const WarningMessages = {
  RESET_WALLET:
    'Are you sure you want to reset your Ghost wallet? This action cannot be undone and will erase\n' +
    ' all your data. The only way to recover your wallet is by importing your 12-word secret recovery\n' +
    " phrase. It's not necessary to remember your password, as you will be prompted to create a new one.",

  FORGOT_PASSWORD:
    'The only way to reset your password is by resetting your wallet. You can re-import your wallet\n' +
    ' with your 12-word secret phrase. Are you sure you still want to reset your Ghost wallet? This action' +
    ' cannot be undone and will erase all your data.',

  NEW_SEED_PHRASE:
    'This secret recovery phrase is the only way to restore your wallet. Write it down on paper and save it in a secure location. ' +
    'Beware of fake customer support scammers who may try to contact you.',

  CUSTOMER_SUPPORT:
    'Beware of customer support scams. There are scammers pretending to be Ghost staff members who send out friend requests and direct messages. ' +
    'Legitimate Ghost staff members communicate in public channels. Beware of fake Discord servers, Telegram groups, ' +
    'X pages, websites, and wallets. Never give your seed phrase out to anyone.',

  LOW_LIQUIDITY: (difference: any, percentageLoss: any) =>
    `This trade will result in a loss of $${difference.toFixed(
      2,
    )} (-${percentageLoss}%), which is due to low liquidity. The money you lose on this trade will be irreversible. Trade in smaller amounts to get better rates.`,

  MINT_RISK: (ticker: string) =>
    `Minting is a risky operation that could result in permanently lost KAS. This would happen if you have unfinished mints 
    on the network while the ${ticker} minted percentage hits 100%. It's safer to mint tokens in multiple batches of small amounts 
    and when the minted supply percentage is low.`,
}
