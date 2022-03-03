import { AccountName, AuthProvider, ChainAccount, ChainNetwork } from '../common/models'

// ORE ID Types

export type TransactionData = {
  account?: AccountName // user's oreid - set automatically by Transaction object
  chainAccount?: ChainAccount // chainAccount not required for Ethereum - it can be defined by the account that signed the transaction
  chainNetwork: ChainNetwork
  expireSeconds?: number
  signedTransaction?: string // 'raw' transaction that potentially includes signatures too
  transaction?: string // either transaction or signedTransaction - not both
  transactionChainAccount?: string // used to sepecify a specific 'from' account for multisig tx
  transactionRecordId?: string // when set, specifies to use a transaction saved in OREID
  signOptions?: {
    allowChainAccountSelection?: boolean
    broadcast?: boolean
    generateAutoSignCredential?: boolean
    multiSigChainAccounts?: string // Comma seperated string of accounts - for which OREID should add signatures
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
}
