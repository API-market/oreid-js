import {
  ProcessId,
  AppAccessToken,
  AccountName,
  ChainAccount,
  PublicKey,
  PermissionName,
  Color,
  ConfigType,
  ChainPlatformType,
  ChainNetwork,
  AccountType,
  LoginProvider,
  ExternalWalletType,
  AuthProvider,
  ApiKeyUsedFor,
  SettingChainNetwork,
  SettingChainNetworkHost,
  Lookup,
  AlgorandMultiSigOptions,
  JSONValue,
  JSONArray,
  JSONObject,
} from './models'

function isProcessId(obj: any): obj is ProcessId {
  return obj === 'ProcessId value'
}

const pid: ProcessId = 'ProcessId value'

describe('Process Id type', () => {
  test('type can be instantiated', () => {
    expect(isProcessId(pid)).toBeTruthy()
  })
})

function isAppAccessToken(obj: any): obj is AppAccessToken {
  return obj === 'AppAccessToken value'
}

const aat: AppAccessToken = 'AppAccessToken value'

describe('App Access Token type', () => {
  test('type can be instantiated', () => {
    expect(isAppAccessToken(aat)).toBeTruthy()
  })
})

function isAccountName(obj: any): obj is AccountName {
  return obj === 'AccountName value'
}

const an: AccountName = 'AccountName value'

describe('Account Name type', () => {
  test('type can be instantiated', () => {
    expect(isAccountName(an)).toBeTruthy()
  })
})

function isChainAccount(obj: any): obj is ChainAccount {
  return obj === 'ChainAccount value'
}

const ca: ChainAccount = 'ChainAccount value'

describe('Chain Account type', () => {
  test('type can be instantiated', () => {
    expect(isChainAccount(ca)).toBeTruthy()
  })
})

function isPublicKey(obj: any): obj is PublicKey {
  return obj === 'PublicKey value'
}

const pk: PublicKey = 'PublicKey value'

describe('Public Key type', () => {
  test('type can be instantiated', () => {
    expect(isPublicKey(pk)).toBeTruthy()
  })
})

function isPermissionName(obj: any): obj is PermissionName {
  return obj === 'PermissionName value'
}

const pn: PermissionName = 'PermissionName value'

describe('Permission Name type', () => {
  test('type can be instantiated', () => {
    expect(isPermissionName(pn)).toBeTruthy()
  })
})

function isColor(obj: any): obj is Color {
  return obj === 'Color value'
}

const c: Color = 'Color value'

describe('Color type', () => {
  test('type can be instantiated', () => {
    expect(isColor(c)).toBeTruthy()
  })
})

describe('Config Type enum', () => {
  test('enum can be instantiated', () => {
    let configType = ConfigType.Chains
    expect(configType).toEqual('chains')
  })
})

describe('Chain Platform Type enum', () => {
  test('enum can be instantiated', () => {
    let chainPlatformType = ChainPlatformType.algorand
    expect(chainPlatformType).toEqual('algorand')
    chainPlatformType = ChainPlatformType.eos
    expect(chainPlatformType).toEqual('eos')
    chainPlatformType = ChainPlatformType.ethereum
    expect(chainPlatformType).toEqual('ethereum')
    chainPlatformType = ChainPlatformType.ore
    expect(chainPlatformType).toEqual('ore')
  })
})

describe('Chain Network enum', () => {
  test('enum can be instantiated', () => {
    let chainNetwork = ChainNetwork.AlgoMain
    expect(chainNetwork).toEqual('algo_main')
    chainNetwork = ChainNetwork.AlgoBeta
    expect(chainNetwork).toEqual('algo_beta')
    chainNetwork = ChainNetwork.AlgoTest
    expect(chainNetwork).toEqual('algo_test')
    chainNetwork = ChainNetwork.AvalancheC_Main
    expect(chainNetwork).toEqual('avalanchec_main')
    chainNetwork = ChainNetwork.AvalancheC_Fuji
    expect(chainNetwork).toEqual('avalanchec_fuji')
    chainNetwork = ChainNetwork.DspEosKylin1
    expect(chainNetwork).toEqual('kylin-dsp-1.liquidapps.io')
    chainNetwork = ChainNetwork.DspEosKylin2
    expect(chainNetwork).toEqual('kylin-dsp-2.liquidapps.io')
    chainNetwork = ChainNetwork.DspMoonlighting
    expect(chainNetwork).toEqual('eos_moon_blockstartdsp_com')
    chainNetwork = ChainNetwork.DspMoonlightingTest
    expect(chainNetwork).toEqual('eos_moontest_blockstartdsp_com')
    chainNetwork = ChainNetwork.EthMain
    expect(chainNetwork).toEqual('eth_main')
    chainNetwork = ChainNetwork.EthRopsten
    expect(chainNetwork).toEqual('eth_ropsten')
    chainNetwork = ChainNetwork.EthRinkeby
    expect(chainNetwork).toEqual('eth_rinkeby')
    chainNetwork = ChainNetwork.EthGoerli
    expect(chainNetwork).toEqual('eth_goerli')
    chainNetwork = ChainNetwork.EosMain
    expect(chainNetwork).toEqual('eos_main')
    chainNetwork = ChainNetwork.EosKylin
    expect(chainNetwork).toEqual('eos_kylin')
    chainNetwork = ChainNetwork.EosJungle
    expect(chainNetwork).toEqual('eos_jungle')
    chainNetwork = ChainNetwork.MigrateEosMain
    expect(chainNetwork).toEqual('migrate_eos_main')
    chainNetwork = ChainNetwork.OreMain
    expect(chainNetwork).toEqual('ore_main')
    chainNetwork = ChainNetwork.OreTest
    expect(chainNetwork).toEqual('ore_test')
    chainNetwork = ChainNetwork.PolygonMain
    expect(chainNetwork).toEqual('polygon_main')
    chainNetwork = ChainNetwork.PolygonMumbai
    expect(chainNetwork).toEqual('polygon_mumbai')
    chainNetwork = ChainNetwork.TelosMain
    expect(chainNetwork).toEqual('telos_main')
    chainNetwork = ChainNetwork.TelosTest
    expect(chainNetwork).toEqual('telos_test')
    chainNetwork = ChainNetwork.TelosEvmMain
    expect(chainNetwork).toEqual('telosevm_main')
    chainNetwork = ChainNetwork.TelosEvmTest
    expect(chainNetwork).toEqual('telosevm_test')
    chainNetwork = ChainNetwork.UxMain
    expect(chainNetwork).toEqual('ux_main')
    chainNetwork = ChainNetwork.WaxMain
    expect(chainNetwork).toEqual('wax_main')
    chainNetwork = ChainNetwork.WaxTest
    expect(chainNetwork).toEqual('wax_test')
  })
})

describe('Account Type enum', () => {
  test('enum can be instantiated', () => {
    let accountType = AccountType.Native
    expect(accountType).toEqual('native')
    accountType = AccountType.Pending
    expect(accountType).toEqual('pending')
    accountType = AccountType.VirtualLiquid
    expect(accountType).toEqual('liquid')
    accountType = AccountType.VirtualNested
    expect(accountType).toEqual('nested')
  })
})

describe('Login Provider enum', () => {
  test('enum can be instantiated', () => {
    let loginProvider = LoginProvider.Custodial
    expect(loginProvider).toEqual('custodial')
    loginProvider = LoginProvider.Apple
    expect(loginProvider).toEqual('apple')
    loginProvider = LoginProvider.Email
    expect(loginProvider).toEqual('email')
    loginProvider = LoginProvider.Facebook
    expect(loginProvider).toEqual('facebook')
    loginProvider = LoginProvider.Github
    expect(loginProvider).toEqual('github')
    loginProvider = LoginProvider.Google
    expect(loginProvider).toEqual('google')
    loginProvider = LoginProvider.Instagram
    expect(loginProvider).toEqual('instagram')
    loginProvider = LoginProvider.Kakao
    expect(loginProvider).toEqual('kakao')
    loginProvider = LoginProvider.Line
    expect(loginProvider).toEqual('line')
    loginProvider = LoginProvider.LinkedIn
    expect(loginProvider).toEqual('linkedin')
    loginProvider = LoginProvider.Phone
    expect(loginProvider).toEqual('phone')
    loginProvider = LoginProvider.Twitch
    expect(loginProvider).toEqual('twitch')
    loginProvider = LoginProvider.Twitter
    expect(loginProvider).toEqual('twitter')
  })
})

describe('External Wallet Type enum', () => {
  test('enum can be instantiated', () => {
    let externalWalletType = ExternalWalletType.AlgoSigner
    expect(externalWalletType).toEqual('algosigner')
    externalWalletType = ExternalWalletType.Anchor
    expect(externalWalletType).toEqual('anchor')
    externalWalletType = ExternalWalletType.Keycat
    expect(externalWalletType).toEqual('keycat')
    externalWalletType = ExternalWalletType.Ledger
    expect(externalWalletType).toEqual('ledger')
    externalWalletType = ExternalWalletType.Lynx
    expect(externalWalletType).toEqual('lynx')
    externalWalletType = ExternalWalletType.Meetone
    expect(externalWalletType).toEqual('meetone')
    externalWalletType = ExternalWalletType.Metro
    expect(externalWalletType).toEqual( 'metro')
    externalWalletType = ExternalWalletType.Portis
    expect(externalWalletType).toEqual('portis')
    externalWalletType = ExternalWalletType.Scatter
    expect(externalWalletType).toEqual('scatter')
    externalWalletType = ExternalWalletType.SimpleEos
    expect(externalWalletType).toEqual('simpleos')
    externalWalletType = ExternalWalletType.TokenPocket
    expect(externalWalletType).toEqual('tokenpocket')
    externalWalletType = ExternalWalletType.WalletConnect
    expect(externalWalletType).toEqual('walletconnect')
    externalWalletType = ExternalWalletType.Web3
    expect(externalWalletType).toEqual('web3')
    externalWalletType = ExternalWalletType.WhaleVault
    expect(externalWalletType).toEqual('whalevault')
    externalWalletType = ExternalWalletType.Wombat
    expect(externalWalletType).toEqual('wombat')
  })
})

describe('Auth Provider enum', () => {
  test('enum can be instantiated', () => {
    let authProvider = AuthProvider.Custodial
    expect(authProvider).toEqual('custodial')
    authProvider = AuthProvider.Apple
    expect(authProvider).toEqual('apple')
    authProvider = AuthProvider.Email
    expect(authProvider).toEqual('email')
    authProvider = AuthProvider.Facebook
    expect(authProvider).toEqual('facebook')
    authProvider = AuthProvider.Github
    expect(authProvider).toEqual('github')
    authProvider = AuthProvider.Google
    expect(authProvider).toEqual('google')
    authProvider = AuthProvider.Instagram
    expect(authProvider).toEqual('instagram')
    authProvider = AuthProvider.Kakao
    expect(authProvider).toEqual('kakao')
    authProvider = AuthProvider.Line
    expect(authProvider).toEqual('line')
    authProvider = AuthProvider.LinkedIn
    expect(authProvider).toEqual('linkedin')
    authProvider = AuthProvider.Phone
    expect(authProvider).toEqual('phone')
    authProvider = AuthProvider.Twitch
    expect(authProvider).toEqual('twitch')
    authProvider = AuthProvider.Twitter
    expect(authProvider).toEqual('twitter')
    authProvider = AuthProvider.AlgoSigner
    expect(authProvider).toEqual('algosigner')
    authProvider = AuthProvider.Anchor
    expect(authProvider).toEqual('anchor')
    authProvider = AuthProvider.Keycat
    expect(authProvider).toEqual('keycat')
    authProvider = AuthProvider.Ledger
    expect(authProvider).toEqual('ledger')
    authProvider = AuthProvider.Lynx
    expect(authProvider).toEqual('lynx')
    authProvider = AuthProvider.Meetone
    expect(authProvider).toEqual('meetone')
    authProvider = AuthProvider.Metro
    expect(authProvider).toEqual('metro')
    authProvider = AuthProvider.Portis
    expect(authProvider).toEqual('portis')
    authProvider = AuthProvider.Scatter
    expect(authProvider).toEqual('scatter')
    authProvider = AuthProvider.SimpleEos
    expect(authProvider).toEqual('simpleos')
    authProvider = AuthProvider.TokenPocket
    expect(authProvider).toEqual('tokenpocket')
    authProvider = AuthProvider.WalletConnect
    expect(authProvider).toEqual('walletconnect')
    authProvider = AuthProvider.Web3
    expect(authProvider).toEqual('web3')
    authProvider = AuthProvider.WhaleVault
    expect(authProvider).toEqual('whalevault')
    authProvider = AuthProvider.Wombat
    expect(authProvider).toEqual('wombat')
    authProvider = AuthProvider.OreId
    expect(authProvider).toEqual('oreid')
  })
})

describe('Api Key Used For enum', () => {
  test('enum can be instantiated', () => {
    let apiKeyUsedFor = ApiKeyUsedFor.AccountMigration
    expect(apiKeyUsedFor).toEqual('accountMigration')
    apiKeyUsedFor = ApiKeyUsedFor.Airdrop
    expect(apiKeyUsedFor).toEqual('airdrop')
    apiKeyUsedFor = ApiKeyUsedFor.AdminAccess
    expect(apiKeyUsedFor).toEqual('adminAccess')
    apiKeyUsedFor = ApiKeyUsedFor.AutoSigning
    expect(apiKeyUsedFor).toEqual('autoSigning')
    apiKeyUsedFor = ApiKeyUsedFor.ChangePassword
    expect(apiKeyUsedFor).toEqual('changePassword')
    apiKeyUsedFor = ApiKeyUsedFor.CreateUser
    expect(apiKeyUsedFor).toEqual('createUser')
    apiKeyUsedFor = ApiKeyUsedFor.ProxySigning
    expect(apiKeyUsedFor).toEqual('proxySigning')
    apiKeyUsedFor = ApiKeyUsedFor.TokenFunding
    expect(apiKeyUsedFor).toEqual('tokenFunding')
  })
})

function isSettingChainNetworkHost(obj: any): obj is SettingChainNetworkHost {
  return (
    'chainId' in obj &&
    obj.chainId === 'chainId value' &&
    'forkName' in obj &&
    obj.forkName === 'forkName value' &&
    'host' in obj &&
    obj.host === 'host value' &&
    'port' in obj &&
    obj.port === 0 &&
    'protocol' in obj &&
    obj.protocol === 'https'
  )
}

const scnh: SettingChainNetworkHost = {
  chainId: 'chainId value',
  forkName: 'forkName value',
  host: 'host value',
  port: 0,
  protocol: 'https',
}

describe('Setting Chain Network Host type', () => {
  test('type can be instantiated', () => {
    expect(isSettingChainNetworkHost(scnh)).toBeTruthy()
  })
})

function isSettingChainNetwork(obj: any): obj is SettingChainNetwork {
  return (
    'blockExplorerAccountUrl' in obj &&
    obj.blockExplorerAccountUrl === 'blockExplorerAccountUrl value' &&
    'blockExplorerTxUrl' in obj &&
    obj.blockExplorerTxUrl === 'blockExplorerTxUrl value' &&
    'chainCommunicationSettings' in obj &&
    obj.chainCommunicationSettings === 'chainCommunicationSettings value' &&
    'createBridgeContract' in obj &&
    obj.createBridgeContract === 'createBridgeContract value' &&
    'defaultTransactionSettings' in obj &&
    obj.defaultTransactionSettings === 'defaultTransactionSettings value' &&
    'dfuseNetwork' in obj &&
    obj.dfuseNetwork === 'dfuseNetwork value' &&
    'hosts' in obj &&
    Array.isArray(obj.hosts) &&
    obj.hosts.length == 1 &&
    'chainId' in obj.hosts[0] &&
    obj.hosts[0].chainId === 'chainId value' &&
    'forkName' in obj.hosts[0] &&
    obj.hosts[0].forkName === 'forkName value' &&
    'host' in obj.hosts[0] &&
    obj.hosts[0].host === 'host value' &&
    'port' in obj.hosts[0] &&
    obj.hosts[0].port === 0 &&
    'protocol' in obj.hosts[0] &&
    obj.hosts[0].protocol === 'https' &&
    'isTestNetwork' in obj &&
    obj.isTestNetwork &&
    'monitorConfig' in obj &&
    'dfuseSupported' in obj.monitorConfig &&
    obj.monitorConfig.dfuseSupported === true &&
    'endpoint' in obj.monitorConfig &&
    obj.monitorConfig.endpoint === 'monitorConfig endpoint value' &&
    'name' in obj &&
    obj.name === 'name value' &&
    'logoUrl' in obj &&
    obj.logoUrl === 'logoUrl value' &&
    'network' in obj &&
    obj.network === 'algo_beta' &&
    'type' in obj &&
    obj.type === 'algorand'
  )
}

const scn: SettingChainNetwork = {
  blockExplorerAccountUrl: 'blockExplorerAccountUrl value',
  blockExplorerTxUrl: 'blockExplorerTxUrl value',
  chainCommunicationSettings: 'chainCommunicationSettings value',
  createBridgeContract: 'createBridgeContract value',
  defaultTransactionSettings: 'defaultTransactionSettings value',
  dfuseNetwork: 'dfuseNetwork value',
  hosts: [scnh],
  isTestNetwork: true,
  monitorConfig: {
    dfuseSupported: true,
    endpoint: 'monitorConfig endpoint value',
  },
  name: 'name value',
  logoUrl: 'logoUrl value',
  network: ChainNetwork.AlgoBeta,
  type: ChainPlatformType.algorand,
}

describe('Setting Chain Network type', () => {
  test('type can be instantiated', () => {
    expect(isSettingChainNetwork(scn)).toBeTruthy()
  })
})

function isAlgorandMultiSigOptions(obj: any): obj is AlgorandMultiSigOptions {
  return (
    'version' in obj &&
    obj.version === 0 &&
    'threshold' in obj &&
    obj.threshold === 0 &&
    'addrs' in obj &&
    Array.isArray(obj.addrs) &&
    obj.addrs.length == 1 &&
    obj.addrs[0] === 'addr value'
  )
}

const amso: AlgorandMultiSigOptions = {
  version: 0,
  threshold: 0,
  addrs: ['addr value'],
}

describe('Algorand Multi Sig Options type', () => {
  test('type can be instantiated', () => {
    expect(isAlgorandMultiSigOptions(amso)).toBeTruthy()
  })
})

function isLookup(obj: any): obj is Lookup {
  let value: string
  Object.keys(obj).forEach(item => {
    if (item.includes('0')) {
      value = (obj as Lookup)[item]
    }
  })
  return JSON.stringify(value) === '{"key1":"value1"}'
}

const lu: Lookup = [{ key1: 'value1' }, { key2: 'value2' }, { key3: 'value3' }]

describe('Lookup interface', () => {
  test('interface can be instantiated', () => {
    expect(isLookup(lu)).toBeTruthy()
  })
})

function isJSONValue(obj: any): obj is JSONValue {
  return obj === 'jsonValue value'
}

const jsonv: JSONValue = 'jsonValue value'

describe('JSON Value type', () => {
  test('type can be instantiated', () => {
    expect(isJSONValue(jsonv)).toBeTruthy()
  })
})

function isJSONArray(obj: any): obj is JSONArray {
  return Array.isArray(obj) && obj.length === 1 && obj[0] === jsonv
}

const jsona: JSONArray = [jsonv]

describe('JSON Array type', () => {
  test('type can be instantiated', () => {
    expect(isJSONArray(jsona)).toBeTruthy()
  })
})

function isJSONObject(obj: any): obj is JSONObject {
  let value: string
  Object.keys(obj).forEach(item => {
    if (item.includes('x')) {
      value = (obj as Lookup)[item]
    }
  })
  return JSON.stringify(value) === '{"y":"jsonValue value"}'
}

const jo: JSONObject = { x: { y: jsonv } }

describe('JSON Object interface', () => {
  test('interface can be instantiated', () => {
    expect(isJSONObject(jo)).toBeTruthy()
  })
})
