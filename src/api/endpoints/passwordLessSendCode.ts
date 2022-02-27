import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, AuthProvider, ProcessId, RequestType } from '../../models'
import {
  assertHasApiKeyOrAccessToken,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
} from '../helpers'
import { ApiMessageResponse } from '../models'

export type ApiPasswordLessSendCodeParams = {
  email?: string
  phone?: string
  processId?: ProcessId
  provider: AuthProvider
}

/**
 *  Call api account/login-passwordless-send-code
 *  Returns { success: true } if verification code is sent to email/phone
 * */
export async function callApiPasswordLessSendCode(
  oreIdContext: OreIdContext,
  params: ApiPasswordLessSendCodeParams,
): Promise<ApiMessageResponse> {
  const apiName = ApiEndpoint.PasswordLessSendCode

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['provider'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['email', 'phone'], apiName)

  const { email, phone, processId, provider } = params

  const queryParams: Partial<ApiPasswordLessSendCodeParams> = {
    provider,
  }

  if (email) queryParams.email = encodeURIComponent(email)
  if (phone) queryParams.phone = encodeURIComponent(phone) // if user passes in +12103334444, the plus sign needs to be URL encoded

  const response = await oreIdContext.callOreIdApi(
    RequestType.Get,
    ApiEndpoint.PasswordLessSendCode,
    queryParams,
    null,
    processId,
  )
  return response as ApiMessageResponse
}
