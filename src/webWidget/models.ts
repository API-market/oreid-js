/* eslint-disable @typescript-eslint/indent */

import { AuthProvider } from '../common/models'

// IMPORTANT: These types are copied from oreid-service webwidget code

/** version of widget served by server that matches these types */
export const WidgetVersion = '1'

/** Subset of OreIdOptions used by widget */
export type WebWidgetOreIdOptions = {
  accessToken?: string
  appId: string
  backgroundColor?: string
  oreIdUrl: string
  setBusyCallback?: (isBusy: boolean) => void
  eosTransitWalletProviders?: any[] // TODO: remove these from being passed to webwidget
}

export enum WebWidgetPropType {
  Object = 'object',
  String = 'string',
  Function = 'function',
}

export type WebWidgetProps = {
  oreIdOptions: WebWidgetOreIdOptions
  action: {
    name: WebWidgetAction | string
    params: WebWidgetActionParams
  } | null
  onSuccess: ({ data }: { data?: any }) => void
  /** errors is a delimited string of error codes and/or an error message */
  onError: ({ errors, data }: { errors?: string; data?: any }) => void
  timeout?: number
}

/** Actions supported by widget */
export enum WebWidgetAction {
  Auth = 'auth',
  Logout = 'logout',
  NewChainAccount = 'newChainAccount',
  RecoverAccount = 'recoverAccount',
  Sign = 'sign',
}

/** params for Logout action */
export type WebWidgetLogoutParams = {
  /** comma seperated list of login providers e.g. 'google, facebook' or 'all' */
  providers?: string
}

/** valid action param types */
export type WebWidgetActionParams =
  | WebWidgetAuthParams
  | WebWidgetLogoutParams
  | WebWidgetNewAccountParams
  | WebWidgetRecoverAccountParams
  | WebWidgetSignParams
  | any

/** params for Auth action */
export type WebWidgetAuthParams = {
  /** Login provider (e.g. google, email) */
  provider: AuthProvider
  /** user's idToken - can be from a 3rd-party (e.g. Google) - can be used to create a new user account */
  idToken?: string
  /** passwordless login - email to login with (and to send a verification code to) */
  email?: string
  /** passwordless login - phone to login with (and to send a verification code to) */
  phone?: string
  /** whether the */
  linkToAccount?: boolean
}

/** params for New Account action - to create a new blockchain account 'within' a user's OreID account */
export type WebWidgetNewAccountParams = {
  /** User's OreID account (aka wallet account name) */
  account: string
  /** Optional JSON object of account creation options (blockchain-specific) */
  accountOptions?: any
  /** Type of blockchain account to create - usually 'native' */
  accountType: string
  /** A valid chain network name (e.g. eth_main) */
  chainNetwork: string
}

/** params for Recover Account action */
export type WebWidgetRecoverAccountParams = {
  /** User's OreID account (aka wallet account name) */
  account: string
  /** Login provider (e.g. email) - forces user to haved logged-in using this provider before recovery */
  provider?: string
  /** Type of account recovery requested */
  recoverAction: string
}

/** params for Sign action */
export type WebWidgetSignParams = {
  /** User's OreID account (aka wallet account name) */
  account: string
  /** Blockchain account (usually the account signing the transaction) */
  chainAccount?: string
  /** A valid chain network name (e.g. eth_main) */
  chainNetwork: string
  /** The maximum number of seconds for which the transaction will be valid (depends on blockchain-specific limits) */
  expireSeconds?: number
  /** A base64, stringified, JSON object of the transaction to sign - which already includes one or more signatures */
  signedTransaction?: string
  /** A base64, stringified, JSON object of the transaction to sign (format depends on blockchain type) */
  transaction?: string
  /** Optional - provided instead of transaction - OreID must have this transaction saved in its database (only applies to special situations) */
  transactionRecordId?: string
  /** Optional params for signing */
  signOptions: {
    /** Whether an option is displayed to the user to sign with a key in an external wallet (e.g. Metamask) */
    allowChainAccountSelection?: boolean
    /** Whether signed transaction should be automatically sent to the chain */
    broadcast?: boolean
    /** Comma seperated string of accounts for which OreID should add signatures - only valid for accounts managed by OreId */
    multisigChainAccounts?: string
    /** whether the complete signed transaction should be returned */
    returnSignedTransaction?: boolean
  }
}

/** params for Logout action */
export type WebWidgetAuthResult = any // ToDo: Type this
export type WebWidgetLogoutResult = any // ToDo: Type this
export type WebWidgetNewAccountResult = any // ToDo: Type this
export type WebWidgetRecoverAccountResult = any // ToDo: Type this
export type WebWidgetSignResult = any // ToDo: Type this
