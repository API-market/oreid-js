import OreIdContext from '../../core/IOreidContext'
import { AccountName, AccountType, ApiEndpoint, LoginProvider, RequestType, ApiKeyUsedFor } from '../../models'
import { assertHasApiKey, assertParamsHaveOnlyOneOfValues, assertParamsHaveRequiredValues } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiCustodialNewAccountParams = {
  accessToken?: string
  accessTokenProvider?: LoginProvider
  accountType: AccountType
  email?: string
  emailVerified?: boolean
  idToken?: string
  isTestUser?: boolean
  name?: string
  picture?: string
  phone?: string
  phoneVerified?: boolean
  userName?: string
  userPassword?: string
}

export type ApiCustodialNewAccountBodyParams = {
  access_token?: string
  access_token_provider?: LoginProvider
  account_type: AccountType
  email?: string
  email_verified?: boolean
  id_token?: string
  is_test_user?: boolean
  name?: string
  picture?: string
  phone?: string
  phone_verified?: boolean
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
 * Requires an apiKey with the createUser right
 * Returns: accountName of newly created account
 *       OR errorCode, errorMessage, and message if any problems */
export async function callApiCustodialNewAccount(
  oreIdContext: OreIdContext,
  params: ApiCustodialNewAccountParams,
): Promise<ApiCustodialNewAccountResult> {
  const apiName = ApiEndpoint.CustodialNewAccount

  const {
    accessToken,
    accessTokenProvider,
    accountType,
    email,
    emailVerified,
    idToken,
    isTestUser,
    name,
    picture,
    phone,
    phoneVerified,
    userName,
    userPassword,
  } = params
  const body: ApiCustodialNewAccountBodyParams = {
    access_token: accessToken,
    access_token_provider: accessTokenProvider,
    account_type: accountType,
    email,
    email_verified: emailVerified,
    id_token: idToken,
    is_test_user: isTestUser,
    name,
    phone,
    phone_verified: phoneVerified,
    picture,
    user_name: userName,
    user_password: userPassword,
  }

  assertHasApiKey(oreIdContext, ApiKeyUsedFor.CreateUser, apiName)
  assertParamsHaveRequiredValues(params, ['accountType'], apiName)
  assertParamsHaveOnlyOneOfValues(
    params,
    ['user_password', 'user_password_encrypted', 'user_password_encrypted_backup'],
    apiName,
  )
  assertParamsHaveOnlyOneOfValues(params, ['access_token', 'id_token'], apiName)
  if (accessToken && !accessTokenProvider) {
    throw new Error(`Missing required parameter: accessTokenProvider. It is required when using accessToken`)
  }

  if (!accessToken && !idToken && !(email && name)) {
    throw new Error(
      `Missing required parameter(s) for API ${apiName}: Must include email AND name or an idToken or accessToken`,
    )
  }

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CustodialNewAccount, body, null)
  return results // accessToken and idToken
}
