import {
  RequestType,
  ApiEndpoint,
  ApiMessageResult,
  ApiResultWithErrorCode,
  CustodialMigrateAccountParams,
  CustodialMigrateAccountApiBodyParams,
} from './models'
import { AccountName, AccountType, ChainAccount, ChainNetwork } from '../common/models'

describe('Request Type enum', () => {
  test('enum can be instantiated', () => {
    let requestType = RequestType.Get
    expect(requestType).toEqual('get')
    requestType = RequestType.Post
    expect(requestType).toEqual('put')
  })
})

describe('Api Endpoint enum', () => {
  test('enum can be instantiated', () => {
    let apiEndpoint = ApiEndpoint.AddPermission
    expect(apiEndpoint).toEqual('account/add-permission')
    apiEndpoint = ApiEndpoint.AppToken
    expect(apiEndpoint).toEqual('app-token')
    apiEndpoint = ApiEndpoint.CanAutoSign
    expect(apiEndpoint).toEqual('transaction/can-auto-sign')
    apiEndpoint = ApiEndpoint.ConvertOauthTokens
    expect(apiEndpoint).toEqual('account/convert-oauth')
    apiEndpoint = ApiEndpoint.CustodialMigrateAccount
    expect(apiEndpoint).toEqual('custodial/migrate-account')
    apiEndpoint = ApiEndpoint.CustodialNewAccount
    expect(apiEndpoint).toEqual('custodial/new-user')
    apiEndpoint = ApiEndpoint.DeleteTestUser
    expect(apiEndpoint).toEqual('account/delete-test-user')
    apiEndpoint = ApiEndpoint.CustodialSign
    expect(apiEndpoint).toEqual('custodial/sign')
    apiEndpoint = ApiEndpoint.GetUser
    expect(apiEndpoint).toEqual('account/user')
    apiEndpoint = ApiEndpoint.GetConfig
    expect(apiEndpoint).toEqual('services/config')
    apiEndpoint = ApiEndpoint.LoginUserWithToken
    expect(apiEndpoint).toEqual('account/login-user-with-token')
    apiEndpoint = ApiEndpoint.NewUserWithToken
    expect(apiEndpoint).toEqual('account/new-user-with-token')
    apiEndpoint = ApiEndpoint.PasswordLessSendCode
    expect(apiEndpoint).toEqual('account/login-passwordless-send-code')
    apiEndpoint = ApiEndpoint.PasswordLessVerifyCode
    expect(apiEndpoint).toEqual('account/login-passwordless-verify-code')
    apiEndpoint = ApiEndpoint.TransactionSign
    expect(apiEndpoint).toEqual('transaction/sign')
    apiEndpoint = ApiEndpoint.UpdateDelayWalletSetup
    expect(apiEndpoint).toEqual('account/update-delay-wallet-setup')
  })
})

function isApiMessageResult(obj: any): obj is ApiMessageResult {
  return (
    'message' in obj &&
    obj.message === 'message value' &&
    'error' in obj &&
    obj.error === 'error value' &&
    'processId' in obj &&
    obj.processId === 'processId value' &&
    'success' in obj &&
    obj.success === 'success value'
  )
}

const ami: ApiMessageResult = {
  message: 'message value',
  error: 'error value',
  processId: 'processId value',
  success: 'success value',
}

describe('Api Message Result type', () => {
  test('type can be instantiated', () => {
    expect(isApiMessageResult(ami)).toBeTruthy()
  })
})

function isApiResultWithErrorCode(obj: any): obj is ApiResultWithErrorCode {
  return (
    'message' in obj &&
    obj.message === 'message value' &&
    'processId' in obj &&
    obj.processId === 'processId value' &&
    'errorCode' in obj &&
    obj.errorCode === 'errorCode value' &&
    'errorMessage' in obj &&
    obj.errorMessage === 'errorMessage value'
  )
}

const arwec: ApiResultWithErrorCode = {
  message: 'message value',
  processId: 'processId value',
  errorCode: 'errorCode value',
  errorMessage: 'errorMessage value',
}

describe('Api Result With Error Code type', () => {
  test('type can be instantiated', () => {
    expect(isApiResultWithErrorCode(arwec)).toBeTruthy()
  })
})

function isCustodialMigrateAccountParams(obj: any): obj is CustodialMigrateAccountParams {
  console.log(`obj: ${JSON.stringify(obj)}`)
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_main' &&
    'toType' in obj &&
    obj.toType === 'native' &&
    'userPassword' in obj &&
    obj.userPassword === 'userPassword value'
  )
}

const cmap: CustodialMigrateAccountParams = {
  account: 'account value',
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoMain,
  toType: AccountType.Native,
  userPassword: 'userPassword value',
}

describe('Custodial Migrate Account Params type', () => {
  test('type can be instantiated', () => {
    expect(isCustodialMigrateAccountParams(cmap)).toBeTruthy()
  })
})

function isCustodialMigrateAccountApiBodyParams(obj: any): obj is CustodialMigrateAccountApiBodyParams {
  console.log(`obj: ${JSON.stringify(obj)}`)
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'chain_account' in obj &&
    obj.chain_account === 'chain_account value' &&
    'chain_network' in obj &&
    obj.chain_network === 'algo_main' &&
    'to_type' in obj &&
    obj.to_type === 'native' &&
    'user_password' in obj &&
    obj.user_password === 'user_password value'
  )
}

const cmaabp: CustodialMigrateAccountApiBodyParams = {
  account: 'account value',
  chain_account: 'chain_account value',
  chain_network: ChainNetwork.AlgoMain,
  to_type: AccountType.Native,
  user_password: 'user_password value',
}

describe('Custodial Migrate Account Api Body Params type', () => {
  test('type can be instantiated', () => {
    expect(isCustodialMigrateAccountApiBodyParams(cmaabp)).toBeTruthy()
  })
})
