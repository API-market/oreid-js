import OreIdContext from '../../core/IOreidContext'
import {
  AccountName,
  AccountType,
  ApiEndpoint,
  ChainAccount,
  ChainNetwork,
  ProcessId,
  RequestType,
  ServiceAccountUsedFor,
} from '../../models'
import {
  assertHasApiKey,
  assertHasServiceKey,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
} from '../helpers'
import { ApiResponseWithErrorCode } from '../models'

export type ApiCustodialMigrateAccountParams = {
  account: AccountName
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
  processId?: ProcessId
  toType: AccountType
  userPassword: string
  userPasswordEncrypted: string
}

export type ApiCustodialMigrateAccountBodyParams = {
  account: AccountName
  chain_account: ChainAccount
  chain_network: ChainNetwork
  to_type: AccountType
  user_password?: string
  user_password_encrypted?: string
}

export type ApiCustodialMigrateAccountResponse = {
  account: AccountName
} & ApiResponseWithErrorCode

/** Call the custodial/migrate-user api
 * Converts a user account to a new account type
 * Usually used to convert a virtal account to a native account (on-chain)
 * .. and expects the account to be a managed (custodial) account
 * Requires a wallet password (userPassword) on behalf of the user
 * Requires an apiKey and a serviceKey with the accountMigration right
 * Returns: account name of migrated account
 *       OR errorCode, errorMessage, and message if any problems */
export async function callApiCustodialMigrateAccount(
  oreIdContext: OreIdContext,
  params: ApiCustodialMigrateAccountParams,
): Promise<ApiCustodialMigrateAccountResponse> {
  const apiName = ApiEndpoint.CustodialMigrateAccount

  const { account, chainAccount, chainNetwork, processId, toType, userPassword, userPasswordEncrypted } = params
  const body: ApiCustodialMigrateAccountBodyParams = {
    account,
    chain_account: chainAccount,
    chain_network: chainNetwork,
    to_type: toType,
    user_password: userPassword,
    user_password_encrypted: userPasswordEncrypted,
  }

  assertHasApiKey(oreIdContext, apiName)
  assertHasServiceKey(oreIdContext, ServiceAccountUsedFor.AccountMigration, apiName)
  assertParamsHaveRequiredValues(params, ['account', 'chainAccount', 'chainNetwork', 'toType'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['user_password', 'user_password_encrypted'], apiName)

  const results = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.CustodialMigrateAccount,
    body,
    null,
    processId,
  )
  return results
}
