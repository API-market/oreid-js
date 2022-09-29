import { Request, Response } from 'express' // NOTE: We are only using types here - Express library won't be emitted in the build here
import { LoginOptions } from '../auth/models'
import {
  AccountName,
  AccountType,
  AlgorandMultiSigOptions,
  AppAccessToken,
  AuthProvider,
  ChainAccount,
  ChainNetwork,
  ExternalWalletType,
  ProcessId,
  PublicKey,
} from '../common/models'
import { UserData } from '../user/models'

export enum RecoverAccountAction {
  Republic = 'republic',
}

/** For creating a new chainAccount in an existing wallet */
export type NewAccountOptions = {
  account: AccountName // existing wallet account name (ore account)
  accountOptions?: CreateOnChainAccountsOptions
  accountType: AccountType
  chainNetwork?: ChainNetwork
  provider?: AuthProvider // TODO: confirm if we need this
  state?: string
}

export type DiscoverOptions = {
  walletType: ExternalWalletType
  chainNetwork?: ChainNetwork
  oreAccount?: ChainAccount
  discoveryPathIndexList?: number[]
}

export type AuthResult = {
  account?: AccountName
  accessToken?: string
  idToken?: string
  errors?: string[]
  processId?: ProcessId
  state?: string
}

export type NewAccountResult = {
  chainAccount?: string
  errors?: string[]
  processId?: ProcessId
  state?: string
}

export type SignResult = {
  signedTransaction?: string
  transactionId: string
  errors?: string[]
  processId?: ProcessId
  state?: string
}

// Todo: implement passwordReset flow/url
export type PasswordResetOptions = {
  provider: AuthProvider
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  state?: string
  currentAccountPassword?: string // if the user's current password is known, it can be passed in to appAccessToken request
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
  walletType: ExternalWalletType
  chainAccount?: ChainAccount
  chainNetwork: ChainNetwork
  string: string
  message: string
  metadata?: any
}

// Function Params

export type GetOreIdNewChainAccountUrlParams = NewAccountOptions & {
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
  recoverAction?: RecoverAccountAction
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
  user?: UserData
}

type ParamsForResponse = {
  myField?: string
}

export type RequestWithParams = Request & ParamsForRequest
export type ResponseWithParams = Response & ParamsForResponse
