import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, ApiKeyUsedFor, RequestType, SignStringMethod } from '../../models'
import { assertHasApiKey, assertParamsHaveOnlyOneOfValues, assertParamsHaveRequiredValues } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiCustodialSignStringParams = {
  chainAccount: string
  chainNetwork: string
  permission?: string
  stringToSign: string
  /** optional - alternative method of signing (chain-specific) */
  signMethod?: SignStringMethod
  userPassword?: string
  userPasswordEncrypted?: string
}

export type ApiCustodialSignStringBodyParams = {
  chain_account: string
  chain_network: string
  permission?: string
  string_to_sign: string
  sign_method?: SignStringMethod
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

  const { chainAccount, chainNetwork, permission, stringToSign, signMethod, userPassword } = params
  const body: ApiCustodialSignStringBodyParams = {
    chain_account: chainAccount,
    chain_network: chainNetwork,
    permission,
    string_to_sign: stringToSign,
    user_password: userPassword,
  }

  if (signMethod) body.sign_method = signMethod

  assertHasApiKey(oreIdContext, ApiKeyUsedFor.ProxySigning, apiName)
  assertParamsHaveRequiredValues(params, ['chainAccount', 'chainNetwork', 'stringToSign'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['user_password', 'user_password_encrypted'], apiName)

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CustodialSignString, body, null)
  return results
}
