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
    )} (-${percentageLoss}%), which could be due to low liquidity.`,
}
