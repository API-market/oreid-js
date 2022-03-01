import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, RequestType } from '../../models'
import { assertParamsHaveRequiredValues } from '../helpers'
import { ApiResponseWithErrorCode } from '../models'

export type ApiLoginUserWithTokenParams = {
  idToken?: string
}

export type ApiLoginUserWithTokenBodyParams = {
  id_token?: string
}

/** Call api account/login-user-with-token
 * Converts OAuth idToken from some 3rd-party source to OREID Oauth accessTokens
 * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
 * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
 * Requires a valid idToken but no accessToken or apiKey
 * Returns: OreId issued accessToken and user's account name (if new account created, this is a new account name)
 * */
export async function callApiLoginUserWithToken(
  oreIdContext: OreIdContext,
  params: ApiLoginUserWithTokenParams,
): Promise<{ accessToken: string } & ApiResponseWithErrorCode> {
  const apiName = ApiEndpoint.LoginUserWithToken
  const { idToken } = params

  // This function does not require authentication of any kind - since it allows auth by using any idToken

  assertParamsHaveRequiredValues(params, ['idToken'], apiName)

  const body: ApiLoginUserWithTokenBodyParams = {
    id_token: idToken,
  }

  const results = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.LoginUserWithToken,
    body,
    null, // an api key is NOT required to call this api endpoint
  )
  return results // accessToken and idToken
}
