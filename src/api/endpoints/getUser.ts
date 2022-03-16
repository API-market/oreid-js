import OreIdContext from '../../core/IOreidContext'
import { AccountName, ApiEndpoint, RequestType, UserSourceData } from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues, extractProcessIdFromData } from '../helpers'

export type ApiGetUserParams = {
  account: AccountName
}

/**
 *  Fetch user from api account/user endpoint
 *  Returns: UserSourceData for specified account
 */
export async function callApiGetUser(oreIdContext: OreIdContext, params: ApiGetUserParams): Promise<UserSourceData> {
  const apiName = ApiEndpoint.GetUser
  const { account } = params
  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['account'], apiName)
  const queryParams = { account }

  const response = await oreIdContext.callOreIdApi(RequestType.Get, ApiEndpoint.GetUser, queryParams)
  const { data } = extractProcessIdFromData(response)
  return data as UserSourceData
}
