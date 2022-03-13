import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, RequestType } from '../../models'
import { assertParamsHaveRequiredValues } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiNewUserWithTokenParams = {
  idToken?: string
}

export type ApiNewUserWithTokenBodyParams = {
  id_token?: string
}

/** Call api account/new-user-with-token
 * Converts OAuth accesstoken or idToken from some 3rd-party source to OREID Oauth accessTokens
 * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
 * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
 * Requires a valid idToken but no existing OreId issued accessToken or apiKey
 * Returns: OreId issued accessToken and user's account name (if new account created, this is a new account name)
 * */
export async function callApiNewUserWithToken(
  oreIdContext: OreIdContext,
  params: ApiNewUserWithTokenParams,
): Promise<{ accessToken: string } & ApiResultWithErrorCode> {
  const apiName = ApiEndpoint.NewUserWithToken
  const { idToken } = params

  // This function does not require authentication of any kind - since it allows auth by using any accessToken or idToken

  assertParamsHaveRequiredValues(params, ['idToken'], apiName)

  const body: ApiNewUserWithTokenBodyParams = {
    id_token: idToken,
  }

  const results = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.NewUserWithToken,
    body,
    null, // an api key is NOT required to call this api endpoint
  )
  return results // accessToken and idToken
}
