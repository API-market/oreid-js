export type ProcessId = string
export type AppAccessToken = string
export type AccountName = string
export type ChainAccount = string
export type PublicKey = string
export type PermissionName = string
export type Color = string

export enum ConfigType {
  Chains = 'chains',
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
  EthMain = 'eth_main',
  EthRopsten = 'eth_ropsten',
  EthRinkeby = 'eth_rinkeby',
  OreMain = 'ore_main',
  OreTest = 'ore_test',
  DappKylin1 = 'kylin-dsp-1.liquidapps.io',
  DappKylin2 = 'kylin-dsp-2.liquidapps.io',
  TelosMain = 'telos_main',
  TelosTest = 'telos_test',
  WaxMain = 'wax_main',
  WaxTest = 'wax_test',
  UxMain = 'ux_main',
  PolygonMain = 'polygon_main',
  PolygonMumbai = 'polygon_mumbai',
}

/** Physical structure of account */
export enum AccountType {
  Native = 'native',
  Pending = 'pending',
  VirtualLiquid = 'liquid',
  VirtualNested = 'nested',
}

export enum LoginProvider {
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
  WalletConnect = 'walletconnect',
  Web3 = 'web3',
  WhaleVault = 'whalevault',
}

/** All auth providers - including OreId login types (eg 'Facebook') and wallets (eg 'Scatter') */
export enum AuthProvider {
  // ORE ID LoginProvider
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
  WalletConnect = 'walletconnect',
  Web3 = 'web3',
  WhaleVault = 'whalevault',
  // placeholder for signing - meaning non an external wallet
  OreId = 'oreid',
}

export enum ExternalWalletInterface {
  Transit = 'transit',
}

export enum ApiKeyUsedFor {
  AccountMigration = 'accountMigration',
  Airdrop = 'airdrop',
  AdminAccess = 'adminAccess',
  AutoSigning = 'autoSigning',
  ChangePassword = 'changePassword',
  CreateUser = 'createUser',
  ProxySigning = 'proxySigning',
  TokenFunding = 'tokenFunding',
}

/** type returned by oreid sevice config endpoint for chains */
export type SettingChainNetwork = {
  blockExplorerAccountUrl: string
  blockExplorerTxUrl: string
  chainCommunicationSettings: any
  createBridgeContract: string
  defaultTransactionSettings?: any
  /** Url of monitor */
  dfuseNetwork?: string
  hosts: SettingChainNetworkHost[]
  isTestNetwork: boolean
  monitorConfig?: {
    dfuseSupported: boolean
    endpoint: string
  }
  name: string
  logoUrl: string
  network: ChainNetwork
  type: ChainPlatformType
}

export type SettingChainNetworkHost = {
  chainId: string
  /** fork name used to designate a major version */
  forkName?: string
  host: string
  port: number
  protocol: 'https' | 'http'
}

// Chain specific

export type AlgorandMultiSigOptions = {
  version: number
  threshold: number
  addrs: string[]
}

/** helper type to index a JSON object */
export interface Lookup {
  [key: string]: any
}

export type JSONArray = Array<JSONValue>

export type JSONValue = string | number | boolean | Function | JSONObject | JSONArray

export interface JSONObject {
  [x: string]: JSONValue
}
