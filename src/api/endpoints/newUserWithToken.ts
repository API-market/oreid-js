import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, AuthProvider, RequestType } from '../../models'
import {
  assertHasApiKey,
  assertParamsHaveAtLeastOneOfValues,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
} from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiNewUserWithTokenParams = {
  accessToken?: string
  idToken?: string
  provider?: AuthProvider
  isTestUser?: boolean
}

export type ApiNewUserWithTokenBodyParams = {
  id_token?: string
  access_token?: string
  provider?: string
  is_test_user?: boolean
}

/** Call api account/new-user-with-token
 * Converts OAuth accesstoken or idToken from some 3rd-party source to OREID Oauth accessTokens
 * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
 * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
 * Requires ether:
 *  1) a valid idToken (needs no accessToken or apiKey in header)
 *  2) a 3rd-party accessToken (usually not a JWT) and provider param (e.g. 'google') - Requires api-key in header
 * Set isTestUser to true to create a test user - a test user can be deleted using user.deleteTestUser() - this is helpful for testing
 * Returns: OreId issued accessToken and user's account name (if new account created, this is a new account name)
 * */
export async function callApiNewUserWithToken(
  oreIdContext: OreIdContext,
  params: ApiNewUserWithTokenParams,
): Promise<{ accessToken: string } & ApiResultWithErrorCode> {
  const apiName = ApiEndpoint.NewUserWithToken
  const { accessToken, idToken, isTestUser, provider } = params

  // This function does not require authentication of any kind - since it allows auth by using any accessToken or idToken
  assertParamsHaveAtLeastOneOfValues(params, ['idToken', 'accessToken'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['idToken', 'provider'], apiName) // if idToken, then no provider should be given
  if (accessToken) {
    assertParamsHaveRequiredValues(params, ['accessToken', 'provider'], apiName)
    // if we have a 3rd party access token, we must include an api-key
    assertHasApiKey(oreIdContext, null, 'new-user-with-token')
  }

  const body: ApiNewUserWithTokenBodyParams = {}

  if (idToken) {
    body.id_token = idToken
  } else {
    body.access_token = accessToken
    body.provider = provider
  }

  if (isTestUser === true) {
    body.is_test_user = true
  }

  const results = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.NewUserWithToken,
    body,
    null, // an api key is NOT required to call this api endpoint
  )
  return results // accessToken and idToken
}
