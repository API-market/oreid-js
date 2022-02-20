import { OreIdContext } from '../utils/iOreidContext'
import { AccountName, ApiEndpoint, ProcessId, RequestType, UserInfo } from '../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues, extractProcessIdFromData } from './helpers'

export type CallApiGetUserParams = {
  account: AccountName
  processId?: ProcessId
}

/**
 *  Fetch user from api account/user endpoint
 */
export async function callApiGetUser(oreIdContext: OreIdContext, params: CallApiGetUserParams): Promise<UserInfo> {
  const apiName = ApiEndpoint.GetUser
  const { account, processId } = params
  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['account'], apiName)
  const queryParams = { account }

  const response = await oreIdContext.callOreIdApi(RequestType.Get, ApiEndpoint.GetUser, queryParams, null, processId)
  const { data } = extractProcessIdFromData(response)
  return data as UserInfo
}
