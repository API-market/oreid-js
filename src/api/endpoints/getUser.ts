import { OreIdContext } from '../../utils/iOreidContext'
import { AccountName, ApiEndpoint, ProcessId, RequestType, UserInfo } from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues, extractProcessIdFromData } from '../helpers'

export type ApiGetUserParams = {
  account: AccountName
  processId?: ProcessId
}

/**
 *  Fetch user from api account/user endpoint
 *  Returns: UserInfo for specified account
 */
export async function callApiGetUser(oreIdContext: OreIdContext, params: ApiGetUserParams): Promise<UserInfo> {
  const apiName = ApiEndpoint.GetUser
  const { account, processId } = params
  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['account'], apiName)
  const queryParams = { account }

  const response = await oreIdContext.callOreIdApi(RequestType.Get, ApiEndpoint.GetUser, queryParams, null, processId)
  const { data } = extractProcessIdFromData(response)
  return data as UserInfo
}
