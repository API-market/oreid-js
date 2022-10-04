import { AccountName, AccountType, ChainAccount, ChainNetwork } from '../common/models'

export enum RequestType {
  Get = 'get',
  Post = 'put',
}

export enum ApiEndpoint {
  AddPermission = 'account/add-permission',
  AppToken = 'app-token',
  CanAutoSign = 'transaction/can-auto-sign',
  ConvertOauthTokens = 'account/convert-oauth',
  CustodialMigrateAccount = 'custodial/migrate-account',
  CustodialNewAccount = 'custodial/new-user',
  DeleteTestUser = 'account/delete-test-user',
  CustodialSign = 'custodial/sign',
  GetUser = 'account/user',
  GetConfig = 'services/config',
  LoginUserWithToken = 'account/login-user-with-token',
  NewUserWithToken = 'account/new-user-with-token',
  PasswordLessSendCode = 'account/login-passwordless-send-code',
  PasswordLessVerifyCode = 'account/login-passwordless-verify-code',
  TransactionSign = 'transaction/sign',
}

/** Typical API Response (when no data returned) */
export type ApiMessageResult = {
  message?: string
  error?: string
  processId?: string
  success?: string
}

export type ApiResultWithErrorCode = {
  message?: string
  processId?: string
  errorCode?: string
  errorMessage?: string
}

// API params

export type CustodialMigrateAccountParams = {
  account: AccountName
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
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
