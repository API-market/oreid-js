import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, AppAccessTokenMetadata, RequestType, ApiKeyUsedFor } from '../../models'
import { assertHasApiKey } from '../helpers'
import Helpers from '../../utils/helpers'

export type ApiGetAppTokenParams = {
  appAccessTokenMetadata?: AppAccessTokenMetadata
}

/**
 *  Call api app-token to get a new appAccessToken
 *  An apiKey is always required to call this endpoint
 *  Returns: appAccessToken
 * */
export async function callApiGetAppToken(oreIdContext: OreIdContext, params: ApiGetAppTokenParams): Promise<string> {
  const apiName = ApiEndpoint.AppToken
  const { appAccessTokenMetadata } = params

  // to use appAccessTokenMetadata, we require a apiKey with 'createUser' right
  if (!Helpers.isNullOrEmpty(appAccessTokenMetadata)) {
    assertHasApiKey(oreIdContext, ApiKeyUsedFor.CreateUser, apiName)
  } else {
    assertHasApiKey(oreIdContext, null, apiName)
  }
  const { appAccessToken } = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.AppToken,
    appAccessTokenMetadata,
    null,
  )
  return appAccessToken as string
}
