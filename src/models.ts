import { Request, Response } from 'express'
import {
  DiscoveryAccount,
  DiscoverContinueCallback,
  DiscoveryOptions,
  KeyLookupCallback,
  WalletProvider,
  MakeWalletProviderFn,
  WalletAccessContext,
  Wallet,
} from '@aikon/eos-transit/lib'
// EOSJS Types

/** Arguments for `push_transaction` */
export interface PushTransactionArgs {
  signatures: string[]
  serializedTransaction: Uint8Array
}

/** Structure for the raw form of ABIs */
export interface BinaryAbi {
  /** account which has deployed the ABI */
  accountName: string
  /** abi in binary form */
  abi: Uint8Array
}

/** Arguments to `sign` */
export interface SignatureProviderArgs {
  /** Chain transaction is for */
  chainId: string
  /** Public keys associated with the private keys needed to sign the transaction */
  requiredKeys: string[]
  /** Transaction to sign */
  serializedTransaction: Uint8Array
  /** ABIs for all contracts with actions included in `serializedTransaction` */
  abis: BinaryAbi[]
}

/** Signs transactions */
export interface SignatureProvider {
  /** Public keys associated with the private keys that the `SignatureProvider` holds */
  getAvailableKeys: () => Promise<string[]>
  /** Sign a transaction */
  sign: (args: SignatureProviderArgs) => Promise<PushTransactionArgs>
}

/** Raw data extracted from OAuth IDToken */
export type IdToken = {
  sub: string
  nickname: string
  phone_number: string
  email: string
  picture: string
  name: string
  email_verified?: boolean
}

/** Oauth JWTToken */
export type JWTToken = {
  iss: string
  sub: string
  aud: string
  exp: number
  nbf: number
  iat: number
  jti: string
} & { [key: string]: any }

export type OreIdOptions = {
  appId: string
  /** appKey is required to call the oreid API */
  apiKey?: string
  appName: string
  authCallbackUrl?: string
  newAccountCallbackUrl?: string
  signCallbackUrl?: string
  backgroundColor?: Color
  oreIdUrl: string
  serviceKey?: string
  setBusyCallback?: (isBusy: boolean) => {}
  ualProviders?: UalProvider[]
  eosTransitWalletProviders?: TransitWalletProviderFactory[]
}

export enum Config {
  Chains = 'chains',
}

export type ProcessId = string

export type AppAccessToken = string
export type AccountName = string
export type ChainAccount = string
export type PublicKey = string
export type PermissionName = string
export type Color = string

// Transit
export type TransitDiscoveryAccount = DiscoveryAccount
export type TransitDiscoverContinueCallback = DiscoverContinueCallback
export type TransitDiscoverKeyLookupCallback = KeyLookupCallback
export type TransitDiscoveryOptions = DiscoveryOptions
export type TransitWalletProviderFactory = MakeWalletProviderFn
export type TransitWalletProvider = WalletProvider
export type TransitWalletAccessContext = WalletAccessContext
export type TransitWallet = Wallet
// The DiscoveryData type is missing 'note' field in the Transit Library - replicating the type here and adding note
export type TransitDiscoveryData = {
  keyToAccountMap: DiscoveryAccount[]
  keys?: {
    index: number
    key: string
    note?: string
  }[]
}

// Not sure what this type is - perhaps what is returned from the wallet after login?
export type TransitAccountInfo = any

// TODO: type this. Likley should be Authenticator from EOSIO universal-authenticator-library
export type UalProvider = any

// ORE ID Types

export type User = {
  accountName: AccountName
  email: string
  picture: URL
  name: string
  username: string
  permissions: UserPermission[]
  processId?: ProcessId
}

export type UserPermission = {
  chainNetwork: ChainNetwork
  chainAccount: ChainAccount
  permissionName: PermissionName
  publicKey: PublicKey
  privateKeyStoredExterally: false
  externalWalletType: null
  accountType: AccountType
  permission: PermissionName
}

export type WalletPermission = {
  account?: AccountName
  name: PermissionName
  parent?: PermissionName
  publicKey: PublicKey
}

/** Flavor of chain network */
export enum ChainPlatformType {
  algorand = 'algorand',
  eos = 'eos',
  ethereum = 'ethereum',
  ore = 'ore',
}

export enum ChainNetwork {
  AlgoMain = 'algo_main',
  AlgoBeta = 'algo_beta',
  AlgoTest = 'algo_test',
  EosMain = 'eos_main',
  EosKylin = 'eos_kylin',
  EosJugle = 'eos_jungle',
  TelosMain = 'telos_main',
  TelosTest = 'telos_test',
  EthMain = 'eth_main',
  EthRopsten = 'eth_ropsten',
  OreMain = 'ore_main',
  OreTest = 'ore_test',
  DappKylin1 = 'kylin-dsp-1.liquidapps.io',
  DappKylin2 = 'kylin-dsp-2.liquidapps.io',
}

/** Physical structure of account */
export enum AccountType {
  Native = 'native',
  Pending = 'pending',
  VirtualLiquid = 'liquid',
  VirtualNested = 'nested',
}

export enum RecoverAccountAction {
  Republic = 'republic',
}

export enum OreIdProvider {
  Custodial = 'custodial',
  Apple = 'apple',
  Email = 'email',
  Facebook = 'facebook',
  Github = 'github',
  Google = 'google',
  Instagram = 'instagram',
  Kakao = 'kakao',
  Line = 'line',
  LinkedIn = 'linkedin',
  Phone = 'phone',
  Twitch = 'twitch',
  Twitter = 'twitter',
}

export enum ExternalWalletType {
  AlgoSigner = 'algosigner',
  Keycat = 'keycat',
  Ledger = 'ledger',
  Lynx = 'lynx',
  Meetone = 'meetone',
  Metro = 'metro',
  Portis = 'portis',
  Scatter = 'scatter',
  SimpleEos = 'simpleos',
  TokenPocket = 'tokenpocket',
  WhaleVault = 'whalevault',
}

/** All auth providers - including OreId login types (eg 'Facebook') and wallets (eg 'Scatter') */
export enum AuthProvider {
  // ORE ID Providers
  Custodial = 'custodial',
  Apple = 'apple',
  Email = 'email',
  Facebook = 'facebook',
  Github = 'github',
  Google = 'google',
  Instagram = 'instagram',
  Kakao = 'kakao',
  Line = 'line',
  LinkedIn = 'linkedin',
  Phone = 'phone',
  Twitch = 'twitch',
  Twitter = 'twitter',
  // ExternalWalletType
  AlgoSigner = 'algosigner',
  Keycat = 'keycat',
  Ledger = 'ledger',
  Lynx = 'lynx',
  Meetone = 'meetone',
  Metro = 'metro',
  Portis = 'portis',
  Scatter = 'scatter',
  SimpleEos = 'simpleos',
  TokenPocket = 'tokenpocket',
  WhaleVault = 'whalevault',
  // placeholder for signing - meaning non an external wallet
  OreId = 'oreid',
}

export enum ExternalWalletInterface {
  Ual = 'ual',
  Transit = 'transit',
}

/** type returned by oreid sevice config endpoint for chains */
export type SettingChainNetwork = {
  network: ChainNetwork
  type: ChainPlatformType
  isTestNetwork: boolean
  createBridgeContract: ChainAccount
  hosts: [
    {
      host: string
      port: number
      protocol: 'https' | 'http'
      chainId?: string
      forkName?: string
      forkType?: string
    },
  ]
  chainCommunicationSettings: any
  defaultTransactionSettings?: any
  monitorConfig?: {
    dfuseSupported: boolean
    endpoint: string
  }
  /** Url of monitor */
  dfuseNetwork?: string
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
}

export type LoginOptions = {
  provider: AuthProvider
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
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
  expireSeconds?: number
  /** Comma seperated string of accounts - for which OREID should add signatures */
  multiSigChainAccounts?: string
  returnSignedTransaction?: boolean
  processId?: ProcessId
  provider: AuthProvider
  signedTransaction?: string
  transaction?: string
  userPassword?: string
  signatureOnly?: boolean
  state?: string
  callbackUrl?: string
  preventAutoSign?: boolean
  signExternalWithOreId?: boolean
  transactionRecordId?: string
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

// API params

export type CustodialMigrateAccountParams = {
  account: AccountName
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
  processId?: ProcessId
  toType: AccountType
  userPassword: string
}

export type CustodialMigrateAccountApiBodyParams = {
  account: AccountName
  chain_account: ChainAccount
  chain_network: ChainNetwork
  to_type: AccountType
  user_password: string
}

export type CustodialNewAccountParams = {
  accountType: AccountType
  email?: string
  name?: string
  picture?: string
  phone?: string
  userName?: string
  userPassword?: string
  processId?: ProcessId
}

export type CustodialNewAccountApiBodyParams = {
  account_type: AccountType
  email?: string
  name?: string
  picture?: string
  phone?: string
  user_name?: string
  user_password?: string
}

export type GetAccessTokenParams = {
  appAccessTokenMetadata?: AppAccessTokenMetadata
  processId?: ProcessId
}

export type GetNewAppAccessTokenParams = {
  appAccessTokenMetadata?: AppAccessTokenMetadata
  processId?: ProcessId
}

export type PasswordlessApiParams = {
  provider: AuthProvider
  phone?: string
  email?: string
  code?: string
  processId?: ProcessId
}

export type SignTransactionApiBodyParams = {
  account: AccountName
  allow_chain_account_selection?: boolean
  auto_sign?: boolean
  broadcast?: boolean
  chain_account: ChainAccount
  chain_network: ChainNetwork
  expire_seconds?: number
  multisig_chain_accounts?: string
  provider?: AuthProvider
  return_signed_transaction?: boolean
  signature_only?: boolean
  signed_transaction?: string
  transaction?: string
  transaction_record_id?: string
  user_password?: string
}

export type GetRecoverAccountUrlResult = string

export type LoginWithOreIdResult = {
  loginUrl: string
  errors?: string
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
  provider: AuthProvider
  chainAccount?: ChainAccount
  chainNetwork: ChainNetwork
  string: string
  message: string
}

export enum RequestType {
  Get = 'get',
  Post = 'put',
}

export enum ApiEndpoint {
  AddPermission = 'account/add-permission',
  AppToken = 'app-token',
  CanAutoSign = 'transaction/can-auto-sign',
  CustodialMigrateAccount = 'custodial/migrate-account',
  CustodialNewAccount = 'custodial/new-user',
  CustodialSign = 'custodial/sign',
  PasswordLessSendCode = 'account/login-passwordless-send-code',
  PasswordLessVerifyCode = 'account/login-passwordless-verify-code',
  TransactionSign = 'transaction/sign',
  GetUser = 'account/user',
  GetConfig = 'services/config',
}

// Function Params

export type AddPermissionParams = {
  account: AccountName
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
  processId?: ProcessId
  publicKey: PublicKey
  parentPermission: PermissionName
  permission: PermissionName
  provider: AuthProvider
}

export type ConnectToTransitProviderParams = {
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  provider: AuthProvider
}

export type ConnectToUalProviderParams = {
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  provider: AuthProvider
}

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

export type SetupTransitWalletParams = {
  chainNetwork?: ChainNetwork
  provider: AuthProvider
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

export type AlgorandMultiSigOptions = {
  version: number
  threshold: number
  addrs: string[]
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
  user?: User
}

type ParamsForResponse = {
  myField?: string
}

export type RequestWithParams = Request & ParamsForRequest
export type ResponseWithParams = Response & ParamsForResponse
