import {
  IdToken,
  JWTToken,
  LoginOptions,
  LoginWithWalletOptions,
  LoginWithTokenOptions,
  NewUserWithTokenOptions,
} from './models'
import { AuthProvider, ChainAccount, ChainNetwork, ExternalWalletType } from '../common/models'

function isIdToken(obj: any): obj is IdToken {
  return (
    'sub' in obj &&
    obj.sub === 'sub value' &&
    'nickname' in obj &&
    obj.nickname === 'nickname value' &&
    'phone_number' in obj &&
    obj.phone_number === 'phone_number value' &&
    'email' in obj &&
    obj.email === 'email value' &&
    'picture' in obj &&
    obj.picture === 'picture value' &&
    'name' in obj &&
    obj.name === 'name value' &&
    'email_verified' in obj &&
    obj.email_verified
  )
}

const idt: IdToken = {
  sub: 'sub value',
  nickname: 'nickname value',
  phone_number: 'phone_number value',
  email: 'email value',
  picture: 'picture value',
  name: 'name value',
  email_verified: true,
}

describe('Id Token type', () => {
  test('type can be instantiated', () => {
    expect(isIdToken(idt)).toBeTruthy()
  })
})

function isJWTToken(obj: any): obj is JWTToken {
  return (
    'iss' in obj &&
    obj.iss === 'iss value' &&
    'sub' in obj &&
    obj.sub === 'sub value' &&
    'aud' in obj &&
    obj.aud === 'aud value' &&
    'exp' in obj &&
    obj.exp === 0 &&
    'nbf' in obj &&
    obj.nbf === 0 &&
    'iat' in obj &&
    obj.iat === 0 &&
    'jti' in obj &&
    obj.jti === 'jti value'
  )
}

const jwtt: JWTToken = {
  iss: 'iss value',
  sub: 'sub value',
  aud: 'aud value',
  exp: 0,
  nbf: 0,
  iat: 0,
  jti: 'jti value',
}

describe('JWT Token type', () => {
  test('type can be instantiated', () => {
    expect(isJWTToken(jwtt)).toBeTruthy()
  })
})

function isLoginOptions(obj: any): obj is LoginOptions {
  return (
    'provider' in obj &&
    obj.provider === 'algosigner' &&
    'idToken' in obj &&
    obj.idToken === 'idToken value' &&
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'code' in obj &&
    obj.code === 'code value' &&
    'email' in obj &&
    obj.email === 'email value' &&
    'phone' in obj &&
    obj.phone === 'phone value' &&
    'state' in obj &&
    obj.state === 'state value' &&
    'linkToAccount' in obj &&
    obj.linkToAccount === true &&
    'returnAccessToken' in obj &&
    obj.returnAccessToken === true &&
    'returnIdToken' in obj &&
    obj.returnIdToken === true
  )
}

const lo: LoginOptions = {
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
}

describe('Login Options type', () => {
  test('type can be instantiated', () => {
    expect(isLoginOptions(lo)).toBeTruthy()
  })
})

function isLoginWithWalletOptions(obj: any): obj is LoginWithWalletOptions {
  return (
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'walletType' in obj &&
    obj.walletType === 'algosigner'
  )
}

const lwwo: LoginWithWalletOptions = {
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoBeta,
  walletType: ExternalWalletType.AlgoSigner,
}

describe('Login With Wallet Options type', () => {
  test('type can be instantiated', () => {
    expect(isLoginWithWalletOptions(lwwo)).toBeTruthy()
  })
})

function isLoginWithTokenOptions(obj: any): obj is LoginWithTokenOptions {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value' &&
    'idToken' in obj &&
    obj.idToken === 'idToken value' &&
    'provider' in obj &&
    obj.provider === 'algosigner'
  )
}

const lwto: LoginWithTokenOptions = {
  accessToken: 'accessToken value',
  idToken: 'idToken value',
  provider: AuthProvider.AlgoSigner,
}

describe('Login With Token Options type', () => {
  test('type can be instantiated', () => {
    expect(isLoginWithTokenOptions(lwto)).toBeTruthy()
  })
})

function isNewUserWithTokenOptions(obj: any): obj is NewUserWithTokenOptions {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value' &&
    'idToken' in obj &&
    obj.idToken === 'idToken value' &&
    'provider' in obj &&
    obj.provider === 'algosigner' &&
    'isTestUser' in obj &&
    obj.isTestUser === true &&
    'delayWalletSetup' in obj &&
    obj.delayWalletSetup === true
  )
}

const nuwto: NewUserWithTokenOptions = {
  accessToken: 'accessToken value',
  idToken: 'idToken value',
  provider: AuthProvider.AlgoSigner,
  isTestUser: true,
  delayWalletSetup: true,
}

describe('New User With Token Options type', () => {
  test('type can be instantiated', () => {
    expect(isNewUserWithTokenOptions(nuwto)).toBeTruthy()
  })
})
