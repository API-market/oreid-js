import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, RequestType } from '../../models'
import { assertHasApiKey, assertParamsHaveOnlyOneOfValues, assertParamsHaveRequiredValues } from '../helpers'
import Helpers from '../../utils/helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiLoginUserWithTokenParams = {
  accessToken?: string
  idToken?: string
  provider?: string
}

export type ApiLoginUserWithTokenBodyParams = {
  id_token?: string
  access_token?: string
  provider?: string
}

/** Call api account/login-user-with-token
 * Converts OAuth accesstoken or idToken from some 3rd-party source to OREID Oauth accessTokens
 * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
 * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
 * Requires either:
 *  1) a valid idToken (needs no accessToken or apiKey in header)
 *  2) an OreId issued JWT accessToken (needs no accessToken or apiKey in header)
 *  3) a 3rd-party accessToken (usually not a JWT) and provider param (e.g. 'google') - Requires api-key in header
 * Returns: OreId issued accessToken and user's account name (if new account created, this is a new account name)
 * */
export async function callApiLoginUserWithToken(
  oreIdContext: OreIdContext,
  params: ApiLoginUserWithTokenParams,
): Promise<{ accessToken: string } & ApiResultWithErrorCode> {
  const apiName = ApiEndpoint.LoginUserWithToken
  const { accessToken, idToken, provider } = params

  // This function does not require authentication (api-key or accessToken) in request header - when using a signed JWT accessToken or idToken
  // It does require an api-key when using a non-JWT (third-party) accessToken

  assertParamsHaveOnlyOneOfValues(params, ['accessToken', 'idToken'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['idToken', 'provider'], apiName)
  if (accessToken && !Helpers.jwtDecodeSafe(accessToken)) {
    assertParamsHaveRequiredValues(params, ['provider'], apiName)
    // if we have non-JWT access token, we must include an api-key
    assertHasApiKey(oreIdContext, null, 'login-user-with-token')
  }

  const body: ApiLoginUserWithTokenBodyParams = {}

  if (idToken) {
    body.id_token = idToken
  } else {
    body.access_token = accessToken
    body.provider = provider
  }

  const results = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.LoginUserWithToken,
    body,
    null, // an api key is NOT required to call this api endpoint
  )
  return results // accessToken and idToken
}
