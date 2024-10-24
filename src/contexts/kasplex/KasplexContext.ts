import { createContext } from 'react'
import { IKasplex, Transactions } from './kasplexReducer'

export const KasplexContext = createContext<
  | {
      loadKrc20Tokens: (refresh?: boolean) => Promise<void> // Accept refresh parameter
      loadKrc20Transactions: (tick?: string, next?: string, prev?: string) => Promise<Transactions> // Return transactions
      kasplex: IKasplex
    }
  | undefined
>(undefined)
