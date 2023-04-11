import {
  ChainNetwork,
  AuthProvider,
  AccountType,
  ExternalWalletType,
  ChainAccount,
  AlgorandMultiSigOptions,
} from '../common/models'
import {
  AppAccessTokenMetadata,
  AuthResult,
  BinaryAbi,
  CreateOnChainAccountsOptions,
  DiscoverOptions,
  GetOreIdAuthUrlParams,
  GetOreIdNewChainAccountUrlParams,
  GetOreIdRecoverAccountUrlParams,
  GetRecoverAccountUrlResult,
  LoginWithOreIdResult,
  NewAccountAppTokenParams,
  NewAccountOptions,
  NewAccountResult,
  NewAccountWithOreIdResult,
  PasswordResetOptions,
  RecoverAccountAction,
  RequestWithParams,
  ResponseWithParams,
  SignatureProviderSignResult,
  SignResult,
  SignStringParams,
  SignStringResult,
  SignWithOreIdResult,
} from './models'

describe('Recover Account Action enum', () => {
  test('enum can be instantiated', () => {
    let chainPlatformType = RecoverAccountAction.Republic
    expect(chainPlatformType).toEqual('republic')
  })
})

function isNewAccountOptions(obj: any): obj is NewAccountOptions {
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'accountOptions' in obj &&
    'keys' in obj.accountOptions &&
    'publicKeys' in obj.accountOptions.keys &&
    'owner' in obj.accountOptions.keys.publicKeys &&
    obj.accountOptions.keys.publicKeys.owner === 'owner value' &&
    'active' in obj.accountOptions.keys.publicKeys &&
    obj.accountOptions.keys.publicKeys.active === 'active value' &&
    'accountType' in obj &&
    obj.accountType === 'native' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'provider' in obj &&
    obj.provider === 'apple' &&
    'state' in obj &&
    obj.state === 'state value'
  )
}

const nao: NewAccountOptions = {
  account: 'account value',
  accountOptions: { keys: { publicKeys: { owner: 'owner value', active: 'active value' } } },
  accountType: AccountType.Native,
  chainNetwork: ChainNetwork.AlgoBeta,
  provider: AuthProvider.Apple,
  state: 'state value',
}

describe('New Account Options type', () => {
  test('type can be instantiated', () => {
    expect(isNewAccountOptions(nao)).toBeTruthy()
  })
})

function isDiscoverOptions(obj: any): obj is DiscoverOptions {
  return (
    'walletType' in obj &&
    obj.walletType === 'algosigner' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'oreAccount' in obj &&
    obj.oreAccount === 'oreAccount value' &&
    'discoveryPathIndexList' in obj &&
    Array.isArray(obj.discoveryPathIndexList) &&
    obj.discoveryPathIndexList.length == 3 &&
    obj.discoveryPathIndexList[0] === 0
  )
}

const dop: DiscoverOptions = {
  walletType: ExternalWalletType.AlgoSigner,
  chainNetwork: ChainNetwork.AlgoBeta,
  oreAccount: 'oreAccount value',
  discoveryPathIndexList: [0, 1, 2],
}

describe('Discover Options type', () => {
  test('type can be instantiated', () => {
    expect(isDiscoverOptions(dop)).toBeTruthy()
  })
})

function isAuthResult(obj: any): obj is AuthResult {
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value' &&
    'idToken' in obj &&
    obj.idToken === 'idToken value' &&
    'errors' in obj &&
    Array.isArray(obj.errors) &&
    obj.errors.length == 0 &&
    'processId' in obj &&
    obj.processId === 'processId value' &&
    'state' in obj &&
    obj.state === 'state value'
  )
}

const ar: AuthResult = {
  account: 'account value',
  accessToken: 'accessToken value',
  idToken: 'idToken value',
  errors: [],
  processId: 'processId value',
  state: 'state value',
}

describe('Auth Result type', () => {
  test('type can be instantiated', () => {
    expect(isAuthResult(ar)).toBeTruthy()
  })
})

function isNewAccountResult(obj: any): obj is NewAccountResult {
  return (
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    Array.isArray(obj.errors) &&
    obj.errors.length == 0 &&
    'processId' in obj &&
    obj.processId === 'processId value' &&
    'state' in obj &&
    obj.state === 'state value'
  )
}

const nar: NewAccountResult = {
  chainAccount: 'chainAccount value',
  errors: [],
  processId: 'processId value',
  state: 'state value',
}

describe('New Account Result type', () => {
  test('type can be instantiated', () => {
    expect(isNewAccountResult(nar)).toBeTruthy()
  })
})

function isSignResult(obj: any): obj is SignResult {
  return (
    'signedTransaction' in obj &&
    obj.signedTransaction === 'signedTransaction value' &&
    'transactionId' in obj &&
    obj.transactionId === 'transactionId value' &&
    Array.isArray(obj.errors) &&
    obj.errors.length == 0 &&
    'processId' in obj &&
    obj.processId === 'processId value' &&
    'state' in obj &&
    obj.state === 'state value'
  )
}

const sr: SignResult = {
  signedTransaction: 'signedTransaction value',
  transactionId: 'transactionId value',
  errors: [],
  processId: 'processId value',
  state: 'state value',
}

describe('Sign Result type', () => {
  test('type can be instantiated', () => {
    expect(isSignResult(sr)).toBeTruthy()
  })
})

function isPasswordResetOptions(obj: any): obj is PasswordResetOptions {
  return (
    'provider' in obj &&
    obj.provider === 'algosigner' &&
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'state' in obj &&
    obj.state === 'state value' &&
    'currentAccountPassword' in obj &&
    obj.currentAccountPassword === 'currentAccountPassword value'
  )
}

const pro: PasswordResetOptions = {
  provider: AuthProvider.AlgoSigner,
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoBeta,
  state: 'state value',
  currentAccountPassword: 'currentAccountPassword value',
}

describe('Password Reset Options type', () => {
  test('type can be instantiated', () => {
    expect(isPasswordResetOptions(pro)).toBeTruthy()
  })
})

function isGetRecoverAccountUrlResult(obj: any): obj is GetRecoverAccountUrlResult {
  return obj === 'GetRecoverAccountUrlResult value'
}

const graur: GetRecoverAccountUrlResult = 'GetRecoverAccountUrlResult value'

describe('Get Recover Account Url Result type', () => {
  test('type can be instantiated', () => {
    expect(isGetRecoverAccountUrlResult(graur)).toBeTruthy()
  })
})

function isLoginWithOreIdResult(obj: any): obj is LoginWithOreIdResult {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value' &&
    'loginUrl' in obj &&
    obj.loginUrl === 'loginUrl value' &&
    'errors' in obj &&
    obj.errors === 'errors value' &&
    'processId' in obj &&
    obj.processId === 'processId value'
  )
}

const lwoidr: LoginWithOreIdResult = {
  accessToken: 'accessToken value',
  loginUrl: 'loginUrl value',
  errors: 'errors value',
  processId: 'processId value',
}

describe('Login With Ore Id Result type', () => {
  test('type can be instantiated', () => {
    expect(isLoginWithOreIdResult(lwoidr)).toBeTruthy()
  })
})

function isNewAccountWithOreIdResult(obj: any): obj is NewAccountWithOreIdResult {
  return (
    'newAccountUrl' in obj &&
    obj.newAccountUrl === 'newAccountUrl value' &&
    'errors' in obj &&
    obj.errors === 'errors value'
  )
}

const nawoidr: NewAccountWithOreIdResult = {
  newAccountUrl: 'newAccountUrl value',
  errors: 'errors value',
}

describe('New Account With Ore Id Result type', () => {
  test('type can be instantiated', () => {
    expect(isNewAccountWithOreIdResult(nawoidr)).toBeTruthy()
  })
})

function isSignWithOreIdResult(obj: any): obj is SignWithOreIdResult {
  return (
    'processId' in obj &&
    obj.processId === 'processId value' &&
    'signedTransaction' in obj &&
    obj.signedTransaction === 'signedTransaction value' &&
    'transactionId' in obj &&
    obj.transactionId === 'transactionId value' &&
    'signUrl' in obj &&
    obj.signUrl === 'signUrl value' &&
    'errors' in obj &&
    obj.errors === 'errors value'
  )
}

const swoidr: SignWithOreIdResult = {
  processId: 'processId value',
  signedTransaction: 'signedTransaction value',
  transactionId: 'transactionId value',
  signUrl: 'signUrl value',
  errors: 'errors value',
}

describe('Sign With Ore Id Result type', () => {
  test('type can be instantiated', () => {
    expect(isSignWithOreIdResult(swoidr)).toBeTruthy()
  })
})

function isSignStringParams(obj: any): obj is SignStringParams {
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'walletType' in obj &&
    obj.walletType === 'algosigner' &&
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'string' in obj &&
    obj.string === 'string value' &&
    'message' in obj &&
    obj.message === 'message value' &&
    'metadata' in obj &&
    'key' in obj.metadata &&
    obj.metadata.key === 'value'
  )
}

const ssp: SignStringParams = {
  account: 'account value',
  walletType: ExternalWalletType.AlgoSigner,
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoBeta,
  string: 'string value',
  message: 'message value',
  metadata: { key: 'value' },
}

describe('Sign String Params type', () => {
  test('type can be instantiated', () => {
    expect(isSignStringParams(ssp)).toBeTruthy()
  })
})

function isSignStringResult(obj: any): obj is SignStringResult {
  return 'signedString' in obj && obj.signedString === 'signedString value'
}

const ssr: SignStringResult = {
  signedString: 'signedString value',
}

describe('Sign String Result type', () => {
  test('type can be instantiated', () => {
    expect(isSignStringResult(ssr)).toBeTruthy()
  })
})

function isGetOreIdNewChainAccountUrlParams(obj: any): obj is GetOreIdNewChainAccountUrlParams {
  return (
    'callbackUrl' in obj &&
    obj.callbackUrl === 'callbackUrl value' &&
    'backgroundColor' in obj &&
    obj.backgroundColor === 'backgroundColor value'
  )
}

const goidncaup: GetOreIdNewChainAccountUrlParams = {
  ...nao,
  callbackUrl: 'callbackUrl value',
  backgroundColor: 'backgroundColor value',
}

describe('Get OreId New Chain Account Url Params type', () => {
  test('type can be instantiated', () => {
    expect(isGetOreIdNewChainAccountUrlParams(goidncaup)).toBeTruthy()
  })
})

function isGetOreIdAuthUrlParams(obj: any): obj is GetOreIdAuthUrlParams {
  return (
    'callbackUrl' in obj &&
    obj.callbackUrl === 'callbackUrl value' &&
    'backgroundColor' in obj &&
    obj.backgroundColor === 'backgroundColor value'
  )
}

const goidaup: GetOreIdAuthUrlParams = {
  provider: AuthProvider.AlgoSigner,
  idToken: 'idToken value',
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoBeta,
  code: 'code value',
  email: 'email value',
  phone: 'phone value',
  state: 'state value',
  linkToAccount: true,
  returnAccessToken: true,
  returnIdToken: true,
  callbackUrl: 'callbackUrl value',
  backgroundColor: 'backgroundColor value',
}

describe('Get Ore Id Auth Url Params type', () => {
  test('type can be instantiated', () => {
    expect(isGetOreIdAuthUrlParams(goidaup)).toBeTruthy()
  })
})

function isGetOreIdRecoverAccountUrlParams(obj: any): obj is GetOreIdRecoverAccountUrlParams {
  return (
    'callbackUrl' in obj &&
    obj.callbackUrl === 'callbackUrl value' &&
    'backgroundColor' in obj &&
    obj.backgroundColor === 'backgroundColor value'
  )
}

const goidraup: GetOreIdRecoverAccountUrlParams = {
  provider: AuthProvider.AlgoSigner,
  idToken: 'idToken value',
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoBeta,
  code: 'code value',
  email: 'email value',
  phone: 'phone value',
  state: 'state value',
  linkToAccount: true,
  returnAccessToken: true,
  returnIdToken: true,
  account: 'account value',
  backgroundColor: 'backgroundColor value',
  callbackUrl: 'callbackUrl value',
  recoverAction: RecoverAccountAction.Republic,
  overrideAppAccessToken: 'overrideAppAccessToken value',
}

describe('Get Ore Id Recover Account Url Params type', () => {
  test('type can be instantiated', () => {
    expect(isGetOreIdRecoverAccountUrlParams(goidraup)).toBeTruthy()
  })
})

function isCreateOnChainAccountsOptions(obj: any): obj is CreateOnChainAccountsOptions {
  return (
    'keys' in obj &&
    'publicKeys' in obj.keys &&
    'owner' in obj.keys.publicKeys &&
    obj.keys.publicKeys.owner === 'owner value' &&
    'active' in obj.keys.publicKeys &&
    obj.keys.publicKeys.active === 'active value' &&
    'multisigOptions' in obj &&
    'version' in obj.multisigOptions &&
    obj.multisigOptions.version === 0 &&
    'threshold' in obj.multisigOptions &&
    obj.multisigOptions.threshold === 0 &&
    'addrs' in obj.multisigOptions &&
    Array.isArray(obj.multisigOptions.addrs) &&
    obj.multisigOptions.addrs.length == 1 &&
    obj.multisigOptions.addrs[0] == 'addr value'
  )
}

const multisigOptions: AlgorandMultiSigOptions = {
  version: 0,
  threshold: 0,
  addrs: ['addr value'],
}

const cocao: CreateOnChainAccountsOptions = {
  keys: {
    publicKeys: {
      owner: 'owner value',
      active: 'active value',
    },
  },
  multisigOptions,
}

describe('Create OnChain Accounts Options type', () => {
  test('type can be instantiated', () => {
    expect(isCreateOnChainAccountsOptions(cocao)).toBeTruthy()
  })
})

function isNewAccountAppTokenParams(obj: any): obj is NewAccountAppTokenParams {
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'accountType' in obj &&
    obj.accountType === 'native' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'accountOptions' in obj &&
    obj.accountOptions === cocao
  )
}

const naatp: NewAccountAppTokenParams = {
  account: 'account value',
  accountType: AccountType.Native,
  chainNetwork: ChainNetwork.AlgoBeta,
  accountOptions: cocao,
}

describe('New Account App Token Params type', () => {
  test('type can be instantiated', () => {
    expect(isNewAccountAppTokenParams(naatp)).toBeTruthy()
  })
})

function isAppAccessTokenMetadata(obj: any): obj is AppAccessTokenMetadata {
  return (
    'paramsNewAccount' in obj &&
    obj.paramsNewAccount === naatp &&
    'newAccountPassword' in obj &&
    obj.newAccountPassword === 'newAccountPassword value' &&
    'currentAccountPassword' in obj &&
    obj.currentAccountPassword === 'currentAccountPassword value' &&
    Array.isArray(obj.secrets) &&
    obj.secrets.length == 1 &&
    'type' in obj.secrets[0] &&
    obj.secrets[0].type === 'type value' &&
    'value' in obj.secrets[0] &&
    obj.secrets[0].value === 'value value'
  )
}

const aatm: AppAccessTokenMetadata = {
  paramsNewAccount: naatp,
  newAccountPassword: 'newAccountPassword value',
  currentAccountPassword: 'currentAccountPassword value',
  secrets: [{ type: 'type value', value: 'value value' }],
}

describe('App Access Token Metadata type', () => {
  test('type can be instantiated', () => {
    expect(isAppAccessTokenMetadata(aatm)).toBeTruthy()
  })
})

function isRequestWithParams(obj: any): obj is RequestWithParams {
  return (
    'appId' in obj &&
    obj.appId === 'appId value' &&
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value' &&
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'idToken' in obj &&
    obj.idToken === 'idToken value' &&
    'processId' in obj &&
    obj.processId === 'processId value' &&
    'state' in obj &&
    obj.state === 'state value' &&
    'signedTransaction' in obj &&
    obj.signedTransaction === 'signedTransaction value' &&
    'transactionId' in obj &&
    obj.transactionId === 'transactionId value' &&
    !('user' in obj)
  )
}

const rwp = {
  body: {
    field: 'value',
  },
  appId: 'appId value',
  accessToken: 'accessToken value',
  chainAccount: 'chainAccount value',
  idToken: 'idToken value',
  processId: 'processId value',
  state: 'state value',
  signedTransaction: 'signedTransaction value',
  transactionId: 'transactionId value',
} as any as RequestWithParams

describe('Request With Params type', () => {
  test('type can be instantiated', () => {
    expect(isRequestWithParams(rwp)).toBeTruthy()
  })
})

function isResponseWithParams(obj: any): obj is ResponseWithParams {
  return 'myField' in obj && obj.myField === 'myField value'
}

const rspwp = {
  body: {
    field: 'value',
  },
  myField: 'myField value',
} as any as ResponseWithParams

describe('Response With Params type', () => {
  test('type can be instantiated', () => {
    expect(isResponseWithParams(rspwp)).toBeTruthy()
  })
})

function isSignatureProviderSignResult(obj: any): obj is SignatureProviderSignResult {
  return (
    'signatures' in obj &&
    typeof obj.signatures === 'object' &&
    Array.isArray(obj.signatures) &&
    obj.signatures.length == 1 &&
    obj.signatures[0] === 'signature value' &&
    'serializedTransaction' in obj &&
    typeof obj.serializedTransaction === 'object' &&
    obj.serializedTransaction['0'] === 42
  )
}

const uint8 = new Uint8Array(2)
uint8[0] = 42
const spsr = { signatures: ['signature value'], serializedTransaction: uint8 }

describe('Signature Provider Sign Result interface check', () => {
  it('should conform to "BinaryAbi" interface', () => {
    expect(isSignatureProviderSignResult(spsr)).toBeTruthy()
  })
})

function isBinaryAbi(obj: any): obj is BinaryAbi {
  return (
    'accountName' in obj &&
    typeof obj.accountName === 'string' &&
    'abi' in obj &&
    typeof obj.abi === 'object' &&
    obj.abi['0'] === 42
  )
}

const babi = { accountName: 'accountName value', abi: uint8 }

describe('BinaryAbi interface check', () => {
  it('should conform to "BinaryAbi" interface', () => {
    expect(isBinaryAbi(babi)).toBeTruthy()
  })
})
