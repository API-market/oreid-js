import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, ProcessId, RequestType } from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues } from '../helpers'

export type ApiConvertOauthTokensParams = {
  accessToken?: string
  idToken?: string
}

export type ApiConvertOauthTokensBodyParams = {
  access_token?: string
  id_token?: string
}

export type CallApiConvertOauthTokensResults = {
  accessToken: string
  idToken: string
  processId: ProcessId
}

/** Call the account/convert-oauth api
 * Converts OAuth tokens from some 3rd-party source to OREID Oauth tokens
 * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
 * Returns: OreId issued accessToken and idToken
 * */
export async function callApiConvertOauthTokens(
  oreIdContext: OreIdContext,
  params: ApiConvertOauthTokensParams,
): Promise<CallApiConvertOauthTokensResults> {
  const apiName = ApiEndpoint.ConvertOauthTokens
  const { accessToken, idToken } = params

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  // assertParamsHaveOnlyOneOfValues(params, ['accessToken', 'idToken'], apiName)
  assertParamsHaveRequiredValues(params, ['idToken'], apiName)

  const body: ApiConvertOauthTokensBodyParams = {}
  if (accessToken) body.access_token = accessToken
  if (idToken) body.id_token = idToken

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.ConvertOauthTokens, body, null)
  return results // accessToken and idToken
}
