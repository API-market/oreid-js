import Helpers from '../../utils/helpers'
import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, ApiKeyUsedFor, RequestType } from '../../models'
import { assertHasApiKey, assertParamsHaveOnlyOneOfValues, assertParamsHaveRequiredValues } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type SignStringOptions = {
  signMethod: string
} & any

export type ApiCustodialSignStringParams = {
  chainAccount: string
  chainNetwork: string
  permission?: string
  stringToSign: string
  /** optional options */
  options?: SignStringOptions
  userPassword?: string
  userPasswordEncrypted?: string
}

export type ApiCustodialSignStringBodyParams = {
  chain_account: string
  chain_network: string
  permission?: string
  string_to_sign: string
  /** optional options */
  options?: SignStringOptions
  user_password?: string
  user_password_encrypted?: string
}

export type ApiCustodialSignStringResult = {
  signature: string
} & ApiResultWithErrorCode

/** Call the custoidal/sign-string api
 * Signs a string (aka message) using the user's private key
 * Requires a wallet password (userPassword) on behalf of the user
 * Requires an apiKey with the createUser right
 * Optional: options - designates the method of signing to perform (e.g. ethereum.eth_sign, ethereum.eth_signTypedData) and related metadata (e.g. ERC712 types)
 * Returns: signature
 *       OR errorCode, errorMessage, and message if any problems */
export async function callApiCustodialSignString(
  oreIdContext: OreIdContext,
  params: ApiCustodialSignStringParams,
): Promise<ApiCustodialSignStringResult> {
  const apiName = ApiEndpoint.CustodialSignString

  const { chainAccount, chainNetwork, permission, stringToSign, options, userPassword } = params
  const body: ApiCustodialSignStringBodyParams = {
    chain_account: chainAccount,
    chain_network: chainNetwork,
    permission,
    string_to_sign: stringToSign,
    // stringify
    options: Helpers.isNullOrEmpty(options) ? undefined : JSON.stringify(options),
    user_password: userPassword,
  }

  assertHasApiKey(oreIdContext, ApiKeyUsedFor.ProxySigning, apiName)
  assertParamsHaveRequiredValues(params, ['chainAccount', 'chainNetwork', 'stringToSign'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['user_password', 'user_password_encrypted'], apiName)

  if (options && !options.method) {
    throw new Error(`Missing required parameter(s) for API ${apiName}: Options was provided but missing method.`)
  }

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CustodialSignString, body, null)
  return results
}
