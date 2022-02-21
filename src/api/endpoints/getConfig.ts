import { OreIdContext } from '../../utils/iOreidContext'
import { ApiEndpoint, Config, ProcessId, RequestType } from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues } from '../helpers'

export type ApiGetConfigParams = {
  configType: Config.Chains
  processId?: ProcessId
}

/**
 *  Call api services/config to get configuration values of a specific type
 *  Returns: for configType:Config.Chains, returns array of SettingChainNetwork objects for all chains suported by the service
 * */
export async function callApiGetConfig(oreIdContext: OreIdContext, params: ApiGetConfigParams): Promise<any> {
  const apiName = ApiEndpoint.GetConfig

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['configType'], apiName)

  const { configType, processId } = params
  const queryParams = { type: configType }
  const { values } = await oreIdContext.callOreIdApi(
    RequestType.Get,
    ApiEndpoint.GetConfig,
    queryParams,
    null,
    processId,
  )
  return values
}
