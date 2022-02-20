import { AccountName, AccountType, AuthProvider, ChainAccount, ChainNetwork, ProcessId } from '../common/models'
import { AppAccessTokenMetadata } from '../core/models'

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
  CustodialSign = 'custodial/sign',
  GetUser = 'account/user',
  GetConfig = 'services/config',
  LoginUserWithToken = 'account/login-user-with-token',
  PasswordLessSendCode = 'account/login-passwordless-send-code',
  PasswordLessVerifyCode = 'account/login-passwordless-verify-code',
  TransactionSign = 'transaction/sign',
}

/** Typical API Response (when no data returned) */
export type ApiMessageResponse = {
  message?: string
  error?: string
}

// API params

export type ConvertOauthTokensParams = {
  accessToken: string
  idToken: string
  processId?: ProcessId
}

export type ConvertOauthTokensApiBodyParams = {
  access_token: string
  id_token: string
}

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
  idToken?: string
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
  id_token?: string
  name?: string
  picture?: string
  phone?: string
  user_name?: string
  user_password?: string
}

export type GetAppAccessTokenParams = {
  appAccessTokenMetadata?: AppAccessTokenMetadata
  processId?: ProcessId
}

export type GetNewAppAccessTokenApiParams = {
  appAccessTokenMetadata?: AppAccessTokenMetadata
  processId?: ProcessId
}

export type NewUserWithTokenParams = {
  idToken: string
  processId?: ProcessId
}

export type NewUserWithTokenApiBodyParams = {
  id_token: string
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
