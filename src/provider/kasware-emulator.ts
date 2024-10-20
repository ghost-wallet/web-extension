import { EventEmitter } from 'events'

export enum NetworkType {
  Mainnet = 0,
  Testnet = 1,
  Devnet = 2,
  Simnet = 3,
}

const NETWORK_TYPES = [
  {
    value: NetworkType.Mainnet,
    label: 'Kaspa Mainnet',
    name: 'kaspa_mainnet',
    validNames: [0, 'kaspa_mainnet'],
  },
  {
    value: NetworkType.Testnet,
    label: 'Kaspa Testnet 11',
    name: 'kaspa_testnet',
    validNames: ['kaspa_testnet'],
  },
  { value: NetworkType.Devnet, label: 'Kaspa Devnet', name: 'kaspa_devnet', validNames: ['kaspa_devnet'] },
  { value: NetworkType.Simnet, label: 'Kaspa Simnet', name: 'kaspa_simnet', validNames: ['kaspa_simnet'] },
] as const

type NetworkName = (typeof NETWORK_TYPES)[number]['name']
type NetworkValidName = (typeof NETWORK_TYPES)[number]['validNames'][number]

// define the public interface of the kasware object
// https://docs.kasware.xyz/wallet/dev-base/dev-integration
interface KaswareProviderInterface extends EventEmitter {
  /**
   * Connect the current account.
   * @returns Address of current account.
   */
  requestAccounts(): Promise<string[]>
  /**
   * Get address of current account
   * @returns Address of the current account.
   */
  getAccounts(): Promise<string[]>
  /**
   * Get the current network connected to
   * @returns the network
   */
  getNetwork(): Promise<NetworkName>
  /**
   * Switch the network
   * @param network the network to switch to
   * @returns the network switched to
   */
  switchNetwork(network: NetworkValidName): Promise<NetworkName>
  /**
   * disconnect kasware wallet
   * @param origin website origin url
   * @returns
   */
  disconnect(origin: string): Promise<void>
  /**
   * Get publicKey of current account.
   * @returns the public key of the current account
   */
  getPublicKey(): Promise<string>
  /**
   * Get KAS balance
   * @returns
   */
  getBalance(): Promise<{
    /**
     * the confirmed sompi
     */
    confirmed: number
    /**
     * the unconfirmed sompi
     */
    unconfirmed: number
    /**
     * the total sompi
     */
    total: number
  }>
  /**
   * Get KRC20 token balance
   * @returns
   */
  getKRC20Balance(): Promise<
    {
      balance: string
      dec: string
      locked: string
      opScoreMod: string
      tick: string
    }[]
  >
  /**
   * Send KAS
   * @param toAddress the address to send
   * @param sompi the sompi to send
   * @param options
   * @returns transaction id
   */
  sendKaspa(
    toAddress: string,
    sompi: number,
    options?: {
      /**
       *  the network prioity fee. default is 0. Unit is sompi
       */
      priorityFee?: number
    },
  ): Promise<string>
  /**
   *
   * @param msg a string to sign
   * @param type (Optional) "ecdsa" | "bip322-simple". default is "ecdsa"
   * @returns the signature
   */
  signMessage(msg: string, type?: 'ecdsa' | 'bip322-simple'): Promise<string>

  /**
   * Push Transaction
   * @param options
   * @returns transaction id
   */
  pushTx(options: {
    /**
     * rawtx to push
     */
    rawtx: string
  }): Promise<string>
  /**
   * Sign KRC20 Transaction
   * @param inscribeJsonString stringified json object
   * @param type 2 for deployment, 3 for mint, 4 for transfer
   * @param destAddr the address to transfer. it's an optional parameter. only used for transfer
   * @param priorityFee the network prioity fee. default is 0. Unit is kas.
   * @returns transaction id
   */
  signKRC20Transaction(
    inscribeJsonString: string,
    type: 2 | 3 | 4,
    destAddr?: string,
    priorityFee?: number,
  ): Promise<string>

  getVersion(): Promise<string>
}

export class KaswareProvider extends EventEmitter implements KaswareProviderInterface {
  async getVersion(): Promise<string> {
    return 'Ghost'
  }
  requestAccounts(): Promise<string[]> {
    throw new Error('Method not implemented.')
  }
  getAccounts(): Promise<string[]> {
    throw new Error('Method not implemented.')
  }
  getNetwork(): Promise<NetworkName> {
    throw new Error('Method not implemented.')
  }
  switchNetwork(network: NetworkValidName): Promise<NetworkName> {
    throw new Error('Method not implemented.')
  }
  disconnect(origin: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getPublicKey(): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getBalance(): Promise<{
    /**
     * the confirmed sompi
     */
    confirmed: number
    /**
     * the unconfirmed sompi
     */
    unconfirmed: number
    /**
     * the total sompi
     */
    total: number
  }> {
    throw new Error('Method not implemented.')
  }
  getKRC20Balance(): Promise<
    {
      balance: string
      dec: string
      locked: string
      opScoreMod: string
      tick: string
    }[]
  > {
    throw new Error('Method not implemented.')
  }
  sendKaspa(toAddress: string, sompi: number, options?: {
    /**
     *  the network prioity fee. default is 0. Unit is sompi
     */
    priorityFee?: number
  }): Promise<string> {
    throw new Error('Method not implemented.')
  }
  signMessage(msg: string, type?: 'ecdsa' | 'bip322-simple'): Promise<string> {
    throw new Error('Method not implemented.')
  }
  pushTx(options: {
    /**
     * rawtx to push
     */
    rawtx: string
  }): Promise<string> {
    throw new Error('Method not implemented.')
  }
  signKRC20Transaction(inscribeJsonString: string, type: 2 | 3 | 4, destAddr?: string, priorityFee?: number): Promise<string> {
    throw new Error('Method not implemented.')
  }

}

/*

async requestAccounts() {
    console.log('[KaswareProvider] requestAccounts() called')
    return []
  }

  */


