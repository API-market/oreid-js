import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, RequestType } from '../../models'
import { assertParamsHaveOnlyOneOfValues } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiLoginUserWithTokenParams = {
  accessToken?: string
  idToken?: string
}

export type ApiLoginUserWithTokenBodyParams = {
  access_token?: string
  id_token?: string
}

/** Call api account/login-user-with-token
 * Converts OAuth accesstoken or idToken from some 3rd-party source to OREID Oauth accessTokens
 * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
 * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
 * Requires a valid idToken but no existing OreId issued accessToken or apiKey
 * Returns: OreId issued accessToken and user's account name (if new account created, this is a new account name)
 * */
export async function callApiLoginUserWithToken(
  oreIdContext: OreIdContext,
  params: ApiLoginUserWithTokenParams,
): Promise<{ accessToken: string } & ApiResultWithErrorCode> {
  const apiName = ApiEndpoint.LoginUserWithToken
  const { accessToken, idToken } = params

  // This function does not require authentication of any kind - since it allows auth by using any accessToken or idToken

  assertParamsHaveOnlyOneOfValues(params, ['accessToken', 'idToken'], apiName)

  const body: ApiLoginUserWithTokenBodyParams = {}
  if (accessToken) body.access_token = accessToken
  if (idToken) body.id_token = idToken

  const results = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.LoginUserWithToken,
    body,
    null, // an api key is NOT required to call this api endpoint
  )
  return results // accessToken and idToken
}
