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
  oreIdUrl?: string
  setBusyCallback?: (isBusy: boolean) => void
  eosTransitWalletProviders?: any[] // TODO: remove these from being passed to webwidget
}

export type WebWidgetOnSuccess = ({ data }: { data?: any }) => void
export type WebWidgetOnError = (error: Error) => void

export type WebWidgetProps = {
  oreIdOptions: WebWidgetOreIdOptions
  action: {
    name: WebWidgetAction | string
    params: WebWidgetActionParams
  } | null
  /** callback on success */
  onSuccess: WebWidgetOnSuccess
  /** callback if error - error message is a delimited string of error codes and/or an error message */
  onError: WebWidgetOnError
  /** source url for request (e.g. https://yourapp.com) */
  origin: string
  timeout?: number
  /** the time of the request (Epoch time) */
  timestamp?: number
  /** the signture of the request body */
  signature?: string
}

/** Actions supported by widget */
export enum WebWidgetAction {
  Auth = 'auth',
  Logout = 'logout',
  NewChainAccount = 'newChainAccount',
  RecoverAccount = 'recoverAccount',
  Sign = 'sign',
  Buy = 'buy',
  KeyExport = 'key-export',
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
  | WebWidgetNewChainAccountParams
  | WebWidgetRecoverAccountParams
  | WebWidgetSignParams
  | WebWidgetKeyExportParams
  | any

/** params for Auth action */
export type WebWidgetAuthParams = {
  /** Login provider (e.g. google, email) */
  provider?: AuthProvider
  /** user's idToken - can be from a 3rd-party (e.g. Google) - can be used to create a new user account */
  idToken?: string
  /** passwordless login - email to login with (and to send a verification code to) */
  email?: string
  /** passwordless login - phone to login with (and to send a verification code to) */
  phone?: string
  /** whether we should link this login attempt to an existing user */
  linkToAccount?: boolean
  /** whether we should skip creation of blockchain accounts for a new user */
  delayWalletSetup?: boolean
}

export type WebWidgetBuyParams = {
  /** Blockchain account (usually the account signing the transaction) */
  chainAccount: string
  /** A valid chain network name (e.g. eth_main) */
  chainNetwork: string
  /** allowed chain networks for buying */
  limitToChains?: string[]
  /** allowed symbols to be bought */
  limitToSymbols?: string[]
  /** when true, accepts test credit card number  */
  useTestMode?: boolean
}

/** params for New Account action - to create a new blockchain account 'within' a user's OreID account */
export type WebWidgetNewChainAccountParams = {
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
  recoverAction?: string
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
  encodedSignedTransaction?: string
  /** A base64, stringified, JSON object of the transaction to sign (format depends on blockchain type) */
  encodedTransaction?: string
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
    /** Prevents the use of auto sign functionality while signing the transaction */
    preventAutosign?: boolean
    /** whether the complete signed transaction should be returned */
    returnSignedTransaction?: boolean
  }
}

export type WebWidgetKeyExportParams = {}

/** Result for Auth action */
export type WebWidgetAuthResult = {
  /** User's OreID account (aka wallet account name) */
  account: string
  /** user's accessToken signed by ORE ID (in JWT format) */
  accessToken?: string
  /** user's idToken signed by ORE ID (in JWT format) */
  idToken?: string
}

export type WebWidgetBuyResult = {
  /** uid for tracking buy requested */
  requesteId: string
  /** operation success */
  success: boolean
  /** error code if any */
  errorCode?: string
  /** error message if any */
  errorMessage?: string
}

/** Result for a server-side Logout action (Depricated) */
export type WebWidgetLogoutResult = {}

/** Result for New Chain Account action */
export type WebWidgetNewChainAccountResult = {
  /** User's new blockchain account name */
  chainAccount: string
}

/** Result for a Recover Account action */
export type WebWidgetRecoverAccountResult = WebWidgetAuthResult

/** Result for Sign transaction action */
export type WebWidgetSignResult = {
  /** array of signatures created during sign flow - signatures might be stringified objects or pure strings */
  signatures?: string[]
  /** completed signed transaction (stringified) */
  signedTransaction?: string
  /** transactionId to identify transaction on blockchain (if returned) */
  transactionId?: string
}

/** Result for Key Export action */
export type WebWidgetKeyExportResult = {
  //  no result - just success or error
}

export type WebWidgetActionResult =
  | WebWidgetAuthResult
  | WebWidgetLogoutResult
  | WebWidgetNewChainAccountResult
  | WebWidgetRecoverAccountResult
  | WebWidgetSignResult
  | WebWidgetKeyExportResult
