import { WalletProvider, MakeWalletProviderFn, WalletAccessContext, Wallet, DiscoveryOptions } from 'eos-transit/lib'

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
  apiKey: string
  appName: string
  authCallbackUrl?: string
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

export type TransitWalletProviderFactory = MakeWalletProviderFn
export type TransitWalletProvider = WalletProvider
export type TransitWalletAccessContext = WalletAccessContext
export type TransitWallet = Wallet
export type TransitDiscoveryOptions = DiscoveryOptions
// Not sure what this type is - perhaps what is returned from the wallet after login?
export type TransitAccountInfo = any

export type TransitProviderIds =
  | 'ledger'
  | 'EOS Lynx'
  | 'meetone_provider'
  | 'metro'
  | 'scatter'
  | 'TokenPocket'
  | 'PortisProvider'
  | 'whalevault'
  | 'simpleos'
  | 'Keycat'

export type TransitProviderAttributes = {
  providerId: TransitProviderIds
  requiresLogin: boolean
  supportsDiscovery: boolean
  supportsSignArbitrary: boolean
  requiresLogoutLoginToDiscover: boolean
  defaultDiscoveryPathIndexList?: number[]
  helpText: {
    login: string
    sign: string
    discover: string
    versionsRequired: string
  }
}

// UAL

export type UalProviderAttributes = {
  requiresLogin: boolean
  supportsSignArbitrary: boolean
  helpText: {
    login: string
    sign: string
    discover: string
    versionsRequired: string
  }
}

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
  processId: ProcessId
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
  EthMain = 'eth_main',
  EthRopstein = 'eth_ropsten',
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

export enum AuthProvider {
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

export enum ExternalWalletProvider {
  Ual = 'ual',
  Transit = 'transit',
}

export enum ExternalWalletType {
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

export type LoginOptions = {
  provider: AuthProvider
  chainAccount?: ChainAccount
  chainNetwork?: ChainNetwork
  code?: string
  email?: string
  phone?: string
  state?: string
  linkToAccount?: boolean
  newAccountPassword?: string
  processId?: ProcessId
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
  processId: ProcessId
  signedTransaction?: string
  transaction?: string
  userPassword?: string
  signatureOnly?: boolean
  state?: string
  provider: AuthProvider
  callbackUrl: string
  preventAutoSign?: boolean
  signExternalWithOreId?: boolean
}

export type AuthResponse = {
  account: AccountName
  accessToken?: string
  idToken?: string
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

// API params

export type CustodialMigrateAccountParams = {
  account: AccountName
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
  processId: ProcessId
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
  newAccountPassword?: string
  processId?: ProcessId
}

export type GetNewAppAccessTokenParams = {
  newAccountPassword: string
  processId: ProcessId
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
  return_signed_transaction?: boolean
  signature_only?: boolean
  signed_transaction?: string
  transaction?: string
  user_password?: string
}

export type SignWithOreIdReturn = {
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
  processId: ProcessId
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

export type GetOreIdAuthUrlParams = LoginOptions & {
  callbackUrl: string
  backgroundColor: string
}

export type SetupTransitWalletParams = {
  chainNetwork?: ChainNetwork
  provider: AuthProvider
}
