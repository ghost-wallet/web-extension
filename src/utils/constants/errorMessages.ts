const ErrorMessages = {
  PASSWORD: {
    TOO_SHORT: 'Must be at least 8 characters',
    MISMATCH: 'Passwords do not match',
    INCORRECT: 'Incorrect password',
  },

  LOGIN: {
    FAILED_DECRYPTION:
      'Failed to get decrypted key. You might not be connected to the network. Please try again later.',
  },

  MNEMONIC: {
    INCORRECT_ENTRIES: 'Incorrect entries',
  },

  RESET: {
    FAILED: (err: any) => `Error resetting wallet: ${err}`,
  },

  NETWORK: {
    NOT_CONNECTED: 'Not connected to network. Please try again later.',
    INSUFFICIENT_FUNDS: (balance: number) =>
      `Not enough Kaspa in wallet to cover network fees. You need at least 1 KAS, but you have ${balance}.`,
  },

  FEES: {
    ESTIMATION: (err: any) => `Fee estimation error: ${err}`,
  },

  TRANSACTION: {
    FAILED_CREATION: 'Failed to create transactions.',
    FAILED_SUBMISSION: 'Failed to submit transaction.',
    CONFIRMATION_ERROR: (err: any) => `Error confirming transaction: ${err}`,
  },

  BUCKETS: {
    FAILED: (err: any) => `Failed to retrieve fee buckets from the network: ${err}`,
  },

  KASPA: {
    INVALID_RECIPIENT_ADDRESS: 'Invalid Kaspa address. Kaspa addresses should start with the kaspa: prefix.',
    ADDRESS_VALIDATION_ERROR: (err: any) => `Error validating address: ${err}`,
  },

  KRC20: {
    INVALID_RECIPIENT: 'Cannot transfer KRC20 tokens to yourself.',
    MISSING: 'Missing KRC20 token information. Please try again.',
    SUBMIT_TXN: (err: any) => `Error occurred trying to submit KRC20 transaction: ${err}`,
  },

  SEND_AMOUNT: {
    MORE_THAN_ZERO: 'Amount should be more than 0.',
    MINIMUM_KASPA: 'Minimum amount to send is 0.2 KASPA.',
    EXCEEDS_BALANCE: (formattedBalance: number) =>
      `Amount must be less than your balance of ${formattedBalance}.`,
    GENERAL: (formattedBalance: number) => `Amount must be more than 0 and less than ${formattedBalance}.`,
  },

  MINT: {
    TOKEN_NOT_FOUND: (ticker: string) => `Token "${ticker}" not found.`,
    SEARCH_FAILED: (ticker: string) => `An unknown error occurred searching for "${ticker}".`,
    REQUIRED_AMOUNT: 'Mint amount is required. You cannot mint 0 times.',
    MINIMUM_AMOUNT: 'A minimum of 5 KAS is required per mint.',
    EXCEEDS_SUPPLY: (availableSupply: number) =>
      `Cannot mint more tokens than the remaining unminted supply: ${availableSupply}.`,
    EXCEEDS_BALANCE: (mintAmount: number, kaspaBalance: number) =>
      `You need at least ${
        mintAmount + 25 + 0.1 * mintAmount
      } KAS in your wallet, but you have ${kaspaBalance.toFixed(
        2,
      )}. Minting requires a minimum of 25 KAS, 10% of the mint cost to cover fees, and 1 KAS per mint.`,
  },

  CHAINGE: {
    FAILED_FETCH: (err: any) => `Error fetching tokens from Chainge: ${err}`,
  },
}

export default ErrorMessages
