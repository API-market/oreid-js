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

/** Named chain network */
export enum ChainNetwork {
  // Algo
  AlgoMain = 'algo_main',
  AlgoBeta = 'algo_beta',
  AlgoTest = 'algo_test',
  // AVALANCHE
  AvalancheC_Main = 'avalanchec_main',
  AvalancheC_Fuji = 'avalanchec_fuji',
  // Dsp/EOS
  DspEosKylin1 = 'kylin-dsp-1.liquidapps.io',
  DspEosKylin2 = 'kylin-dsp-2.liquidapps.io',
  DspMoonlighting = 'eos_moon_blockstartdsp_com',
  DspMoonlightingTest = 'eos_moontest_blockstartdsp_com',
  // DOS
  DosMain = 'dos_main',
  DosTest = 'dos_test',
  // ETH
  EthMain = 'eth_main',
  EthRopsten = 'eth_ropsten',
  EthRinkeby = 'eth_rinkeby',
  EthGoerli = 'eth_goerli',
  // EOS
  EosMain = 'eos_main',
  EosKylin = 'eos_kylin',
  EosJungle = 'eos_jungle',
  MigrateEosMain = 'migrate_eos_main',
  // ORE
  OreMain = 'ore_main',
  OreTest = 'ore_test',
  // Polygon
  PolygonMain = 'polygon_main',
  PolygonMumbai = 'polygon_mumbai',
  // TELOS
  TelosMain = 'telos_main',
  TelosTest = 'telos_test',
  // TELOS EVM
  TelosEvmMain = 'telosevm_main',
  TelosEvmTest = 'telosevm_test',
  // UX
  UxMain = 'ux_main',
  // UxTest = 'ux_test', (there is no test network) - this is left here as a placeholder
  // WAX
  WaxMain = 'wax_main',
  WaxTest = 'wax_test',
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
  Anchor = 'anchor',
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
  Wombat = 'wombat',
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
  Anchor = 'anchor',
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
  Wombat = 'wombat',
  // placeholder for signing - meaning non an external wallet
  OreId = 'oreid',
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
