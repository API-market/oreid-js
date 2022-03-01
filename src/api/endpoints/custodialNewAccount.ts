import OreIdContext from '../../core/IOreidContext'
import { AccountName, AccountType, ApiEndpoint, RequestType, ServiceAccountUsedFor } from '../../models'
import {
  assertHasApiKey,
  assertHasServiceKey,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
} from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiCustodialNewAccountParams = {
  accountType: AccountType
  email?: string
  idToken?: string
  name?: string
  picture?: string
  phone?: string
  userName?: string
  userPassword?: string
}

export type ApiCustodialNewAccountBodyParams = {
  account_type: AccountType
  email?: string
  id_token?: string
  name?: string
  picture?: string
  phone?: string
  user_name?: string
  user_password?: string
  user_password_encrypted?: string
  user_password_encrypted_backup?: string
}

export type ApiCustodialNewAccountResult = {
  accountName: AccountName
} & ApiResultWithErrorCode

/** Call the custodial/new-user api
 * Create a new user account that is managed by your app
 * Requires a wallet password (userPassword) on behalf of the user
 * Requires an apiKey and a serviceKey with the createUser right
 * Returns: accountName of newly created account
 *       OR errorCode, errorMessage, and message if any problems */
export async function callApiCustodialNewAccount(
  oreIdContext: OreIdContext,
  params: ApiCustodialNewAccountParams,
): Promise<ApiCustodialNewAccountResult> {
  const apiName = ApiEndpoint.CustodialNewAccount

  const { accountType, email, idToken, name, picture, phone, userName, userPassword } = params
  const body: ApiCustodialNewAccountBodyParams = {
    account_type: accountType,
    email,
    id_token: idToken,
    name,
    phone,
    picture,
    user_name: userName,
    user_password: userPassword,
  }

  assertHasApiKey(oreIdContext, apiName)
  assertHasServiceKey(oreIdContext, ServiceAccountUsedFor.CreateUser, apiName)
  assertParamsHaveRequiredValues(params, ['accountType'], apiName)
  assertParamsHaveOnlyOneOfValues(
    params,
    ['user_password', 'user_password_encrypted', 'user_password_encrypted_backup'],
    apiName,
  )

  if (!idToken && !(email && name)) {
    throw new Error(`Missing required parameter(s) for API ${apiName}: Must include email AND name or an idToken`)
  }

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CustodialNewAccount, body, null)
  return results // accessToken and idToken
}
