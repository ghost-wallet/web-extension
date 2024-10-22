import { createContext } from 'react'
import { IKasplex } from './kasplexReducer'

export const KasplexContext = createContext<
  | {
      loadTokens: () => Promise<void>
      loadOperations: (tick?: string, next?: string, prev?: string) => Promise<void>
      kasplex: IKasplex
    }
  | undefined
>(undefined)
