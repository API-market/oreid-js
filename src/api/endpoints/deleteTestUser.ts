import OreIdContext from '../../core/IOreidContext'
import { AccountName, ApiEndpoint, RequestType } from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues, extractProcessIdFromData } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ApiDeleteTestUserParams = {
  account: AccountName
}

export type ApiDeleteTestUserResult = {
  success: boolean
} & ApiResultWithErrorCode

/**
 *  Delete a user specifically created as a test user via api account/delete-test-user endpoint
 *  Returns: success or errorCode, errorMessage, if any problems
 */
export async function callApiDeleteTestUser(
  oreIdContext: OreIdContext,
  params: ApiDeleteTestUserParams,
): Promise<ApiDeleteTestUserResult> {
  const apiName = ApiEndpoint.DeleteTestUser
  const { account } = params
  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['account'], apiName)
  const body = { account }

  const response = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.DeleteTestUser, body)
  const { data } = extractProcessIdFromData(response)
  return data as ApiDeleteTestUserResult
}
