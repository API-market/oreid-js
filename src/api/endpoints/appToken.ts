import { OreIdContext } from '../../utils/iOreidContext'
import { ApiEndpoint, AppAccessTokenMetadata, ProcessId, RequestType } from '../../models'
import { assertHasApiKey } from '../helpers'
import Helpers from '../../utils/helpers'

export type ApiGetAppTokenParams = {
  appAccessTokenMetadata?: AppAccessTokenMetadata
  processId?: ProcessId
}

/**
 *  Call api app-token to get a new appAccessToken
 *  An apiKey is always required to call this endpoint
 *  Returns: appAccessToken
 * */
export async function callApiGetAppToken(oreIdContext: OreIdContext, params: ApiGetAppTokenParams): Promise<string> {
  const apiName = ApiEndpoint.AppToken
  const { appAccessTokenMetadata, processId } = params

  assertHasApiKey(oreIdContext, apiName)
  // to use appAccessTokenMetadata, we also require a serviceKey
  if (!Helpers.isNullOrEmpty(appAccessTokenMetadata)) {
    if (!oreIdContext.options?.serviceKey) {
      throw new Error(
        `Missing required header for API ${apiName}: Must have a options.serviceKey to use appAccessTokenMetadata`,
      )
    }
  }
  const { appAccessToken } = await oreIdContext.callOreIdApi(
    RequestType.Post,
    ApiEndpoint.AppToken,
    appAccessTokenMetadata,
    null,
    processId,
  )
  return appAccessToken as string
}
