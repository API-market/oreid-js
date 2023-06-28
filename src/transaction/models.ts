import { AccountName, AuthProvider, ChainAccount, ChainNetwork, JSONObject } from '../common/models'
import { SignStringMethod } from '../webWidget/models'

// ORE ID Types

export type SignStringData = {
  account?: AccountName
  chainAccount?: ChainAccount | string
  chainNetwork: ChainNetwork | string
  /** optional - alternative method of signing (chain-specific) */
  signMethod?: SignStringMethod
  string?: string
}

export type TransactionData = {
  account?: AccountName // user's oreid - set automatically by Transaction object
  chainAccount?: ChainAccount // chainAccount not required for Ethereum - it can be defined by the account that signed the transaction
  chainNetwork: ChainNetwork
  expireSeconds?: number
  signedTransaction?: JSONObject // 'raw' transaction that potentially includes signatures too
  transaction?: JSONObject // either transaction or signedTransaction - not both
  encodedSignedTransaction?: string // Stringified,base64 encoded signedTransaction
  encodedTransaction?: string // Stringified,base64 encoded transaction
  transactionChainAccount?: string // used to sepecify a specific 'from' account for multisig tx
  transactionRecordId?: string // when set, specifies to use a transaction saved in OREID
  signOptions?: TransactionSignOptions
}

export type TransactionSignOptions = {
  allowChainAccountSelection?: boolean
  broadcast?: boolean
  generateAutoSignCredential?: boolean
  multiSigChainAccounts?: string // Comma seperated string of accounts - for which OREID should add signatures
  /** Prevents the use of auto sign functionality while signing the transaction */
  preventAutosign?: boolean
  returnSignedTransaction?: boolean
  signatureOnly?: boolean
  userPassword?: string // custodial
  userPasswordEncrypted?: string // possibly from local storage - non necessarily custodial
  // not for widget
  accessToken?: string
  callbackUrl?: string
  provider?: AuthProvider // force login with this provider
  signExternalWithOreId?: boolean // Remove: opening widget means using oreid
  state?: string
}

export type FeesByPriority = {
  priority: any
  fee: string
  lowFeeErrorMessage: string
}

export type ValidateTransactionFees = {
  chainSupportsFees: boolean
  feesByPriority: FeesByPriority[]
  resourceEstimationType: string
}

export type ValidateTransactionResources = {
  chainSupportsResources: boolean
  resourcesRequired: string
  resourceEstimationType: string
  lowResourceErrorMessages: string[]
}

export interface CreateTransactionData
  extends Omit<TransactionData, 'account' | 'encodedSignedTransaction' | 'encodedTransaction'> {}
