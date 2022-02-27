import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, AuthProvider, ProcessId, RequestType } from '../../models'
import {
  assertHasApiKeyOrAccessToken,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
} from '../helpers'
import { ApiMessageResponse } from '../models'

export type ApiPasswordLessVerifyCodeParams = {
  code?: string
  email?: string
  phone?: string
  processId?: ProcessId
  provider: AuthProvider
}

/**
 *  Call api account/login-passwordless-verify-code
 *  Returns { success: true } if code is verified, throws if code/verification fails
 * */
export async function callApiPasswordLessVerifyCode(
  oreIdContext: OreIdContext,
  params: ApiPasswordLessVerifyCodeParams,
): Promise<ApiMessageResponse> {
  const apiName = ApiEndpoint.PasswordLessVerifyCode

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['code', 'provider'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['email', 'phone'], apiName)

  const { code, email, phone, processId, provider } = params

  const queryParams: Partial<ApiPasswordLessVerifyCodeParams> = {
    code,
    provider,
  }

  if (email) queryParams.email = encodeURIComponent(email)
  if (phone) queryParams.phone = encodeURIComponent(phone) // if user passes in +12103334444, the plus sign needs to be URL encoded

  const response = await oreIdContext.callOreIdApi(
    RequestType.Get,
    ApiEndpoint.PasswordLessVerifyCode,
    queryParams,
    null,
    processId,
  )
  return response as ApiMessageResponse
}
