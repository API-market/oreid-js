import OreIdContext from '../../core/IOreidContext'
import { AccountName, ApiEndpoint, RequestType, UserInfo } from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues, extractProcessIdFromData } from '../helpers'

export type ApiGetUserParams = {
  account: AccountName
}

/**
 *  Fetch user from api account/user endpoint
 *  Returns: UserInfo for specified account
 */
export async function callApiGetUser(oreIdContext: OreIdContext, params: ApiGetUserParams): Promise<UserInfo> {
  const apiName = ApiEndpoint.GetUser
  const { account } = params
  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['account'], apiName)
  const queryParams = { account }

  const response = await oreIdContext.callOreIdApi(RequestType.Get, ApiEndpoint.GetUser, queryParams, null)
  const { data } = extractProcessIdFromData(response)
  return data as UserInfo
}
