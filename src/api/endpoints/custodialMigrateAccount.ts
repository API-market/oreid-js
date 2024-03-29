import OreIdContext from '../../core/IOreidContext'
import {
  AccountName,
  AccountType,
  ApiEndpoint,
  ChainAccount,
  ChainNetwork,
  RequestType,
  ApiKeyUsedFor,
} from '../../models'
import { assertHasApiKey, assertParamsHaveOnlyOneOfValues, assertParamsHaveRequiredValues } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiCustodialMigrateAccountParams = {
  account: AccountName
  chainAccount: ChainAccount
  chainNetwork: ChainNetwork
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

export type ApiCustodialMigrateAccountResult = {
  account: AccountName
} & ApiResultWithErrorCode

/** Call the custodial/migrate-user api
 * Converts a user account to a new account type
 * Usually used to convert a virtal account to a native account (on-chain)
 * .. and expects the account to be a managed (custodial) account
 * Requires a wallet password (userPassword) on behalf of the user
 * Requires an apiKey with the accountMigration right
 * Returns: account name of migrated account
 *       OR errorCode, errorMessage, and message if any problems */
export async function callApiCustodialMigrateAccount(
  oreIdContext: OreIdContext,
  params: ApiCustodialMigrateAccountParams,
): Promise<ApiCustodialMigrateAccountResult> {
  const apiName = ApiEndpoint.CustodialMigrateAccount

  const { account, chainAccount, chainNetwork, toType, userPassword, userPasswordEncrypted } = params
  const body: ApiCustodialMigrateAccountBodyParams = {
    account,
    chain_account: chainAccount,
    chain_network: chainNetwork,
    to_type: toType,
    user_password: userPassword,
    user_password_encrypted: userPasswordEncrypted,
  }

  assertHasApiKey(oreIdContext, ApiKeyUsedFor.AccountMigration, apiName)
  assertParamsHaveRequiredValues(params, ['account', 'chainAccount', 'chainNetwork', 'toType'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['user_password', 'user_password_encrypted'], apiName)

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CustodialMigrateAccount, body, null)
  return results
}
