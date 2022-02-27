import { Request, Response } from 'express' // NOTE: We are only using types here - Express library won't be emitted in the build here
import {
  AccountName,
  AccountType,
  AlgorandMultiSigOptions, // TODO": should this be somewhere else?
  AppAccessToken,
  AuthProvider,
  ChainAccount,
  ChainNetwork,
  Color,
  ProcessId,
  PublicKey,
} from '../common/models'
import { TransitWalletProviderFactory } from '../transit'
import { UserInfo } from '../user/models'

export type OreIdOptions = {
  appId: string
  /** appKey is required to call the oreid API */
  apiKey?: string
  appName: string
  accessToken?: string
  idToken?: string
  authCallbackUrl?: string
  newAccountCallbackUrl?: string
  signCallbackUrl?: string
  backgroundColor?: Color
  /** whether you are using a proxy server - required for api calls or auth calls without idToken */
  isUsingProxyServer?: boolean
  oreIdUrl?: string
  serviceKey?: string
  setBusyCallback?: (isBusy: boolean) => void
  eosTransitWalletProviders?: TransitWalletProviderFactory[]
}

export enum RecoverAccountAction {
  Republic = 'republic',
}

// oreid-js

/** For rediecting to new-account endpoint - to create a chainAccount in an existing wallet */
export type NewAccountOptions = {
  account: AccountName // existing wallet account name (ore account)
  accountType: AccountType
  chainNetwork?: ChainNetwork
  accountOptions?: CreateOnChainAccountsOptions
  provider: AuthProvider
  state?: string
  processId?: ProcessId
  accessToken?: string
  idToken?: string
}

export type LoginOptions = {
  provider?: AuthProvider
  idToken?: string
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  code?: string
  email?: string
  phone?: string
  state?: string
  linkToAccount?: boolean
  processId?: ProcessId
  returnAccessToken?: boolean
  returnIdToken?: boolean
}

export type DiscoverOptions = {
  provider: AuthProvider
  chainNetwork?: ChainNetwork
  oreAccount?: ChainAccount
  discoveryPathIndexList?: number[]
}

export type SignOptions = {
  account: AccountName
  allowChainAccountSelection?: boolean
  broadcast?: boolean
  callbackUrl?: string
  chainAccount?: ChainAccount // chainAccount not required for Ethereum - it can be defined by the account that signed the transaction
  chainNetwork: ChainNetwork
  expireSeconds?: number
  generateAutoSignCredential?: boolean
  /** Comma seperated string of accounts - for which OREID should add signatures */
  multiSigChainAccounts?: string
  preventAutoSign?: boolean
  processId?: ProcessId
  provider: AuthProvider
  returnSignedTransaction?: boolean
  signedTransaction?: string
  signExternalWithOreId?: boolean
  state?: string
  transaction?: string
  transactionChainAccount?: string
  transactionRecordId?: string
  userPassword?: string
  userPasswordEncrypted?: string
}

export type AuthResponse = {
  account: AccountName
  accessToken?: string
  idToken?: string
  errors?: string[]
  processId?: ProcessId
  state?: string
}

export type NewAccountResponse = {
  chainAccount?: string
  errors?: string[]
  processId?: ProcessId
  state?: string
}

export type SignResponse = {
  signedTransaction?: string
  transactionId: string
  errors?: string[]
  processId?: ProcessId
  state?: string
}

// Todo: implement passwordReset flow/url
export type passwordResetOptions = {
  provider: AuthProvider
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  state?: string
  currentAccountPassword?: string // if the user's current password is known, it can be passed in to appAccessToken request
  processId?: ProcessId
}

export type GetRecoverAccountUrlResult = string

export type LoginWithOreIdResult = {
  accessToken?: string
  loginUrl?: string
  errors?: string
  processId?: ProcessId
}

export type NewAccountWithOreIdResult = {
  newAccountUrl: string
  errors?: string
}

export type SignWithOreIdResult = {
  processId?: ProcessId
  signedTransaction?: string
  transactionId?: string
  signUrl?: string
  errors?: string
}

export type SignStringParams = {
  account: AccountName
  provider: AuthProvider
  chainAccount?: ChainAccount
  chainNetwork: ChainNetwork
  string: string
  message: string
}

// Function Params

export type GetOreIdNewAccountUrlParams = NewAccountOptions & {
  callbackUrl: string
  backgroundColor?: string
}

export type GetOreIdAuthUrlParams = LoginOptions & {
  callbackUrl: string
  backgroundColor?: string
}

export type GetOreIdRecoverAccountUrlParams = LoginOptions & {
  account: AccountName
  backgroundColor?: string
  callbackUrl: string
  recoverAction: RecoverAccountAction
  overrideAppAccessToken?: AppAccessToken
}

export type AppAccessTokenMetadata = {
  paramsNewAccount?: NewAccountAppTokenParams
  newAccountPassword?: string
  currentAccountPassword?: string
  secrets?: {
    type: string
    value: string
  }[]
}

/** params for calling new-account service web endpoint (sent via AppAccessToken request) */
export type NewAccountAppTokenParams = {
  account: AccountName // wallet account (ore account name)
  accountType: AccountType
  chainNetwork?: ChainNetwork // chainNetwork to create new account on
  accountOptions: CreateOnChainAccountsOptions
}

export type CreateOnChainAccountsOptions = {
  keys?: {
    publicKeys: {
      owner?: PublicKey
      active: PublicKey
    }
  }
  multisigOptions?: AlgorandMultiSigOptions // || future multisig option types
}

type ParamsForRequest = {
  appId?: string
  accessToken?: string
  chainAccount?: string
  idToken?: string
  processId?: ProcessId
  state?: string
  signedTransaction?: string
  transactionId?: string
  user?: UserInfo
}

type ParamsForResponse = {
  myField?: string
}

export type RequestWithParams = Request & ParamsForRequest
export type ResponseWithParams = Response & ParamsForResponse
