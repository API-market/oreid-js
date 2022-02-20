import Helpers from '../utils/helpers'
import { JSONObject } from '../models'
import { OreIdContext } from '../utils/iOreidContext'

const { isNullOrEmpty } = Helpers

// ---- API Helper functions

/** check the header of the request for each required param in paramNames */
export function assertHeaderhasRequiredValues(params: JSONObject = {}, paramNames: any[], apiName: string) {
  const missing: any[] = []
  paramNames.forEach(p => {
    if (isNullOrEmpty(params[p])) {
      missing.push(p)
    }
  })
  if (!isNullOrEmpty(missing)) {
    throw new Error(`Missing required parameter(s) in request header for API ${apiName}: ${missing.join(', ')}`)
  }
}

/** Check that we have an apiKey or accessToken */
export function assertHasApiKeyOrAccessToken(oreIdContext: OreIdContext, apiName: string) {
  if (!oreIdContext.accessToken && !oreIdContext.options?.apiKey) {
    throw new Error(`Missing required header for API ${apiName}: Must have a valid user accessToken or options.apiKey`)
  }
}

/** Check that we have an accessToken */
export function assertHasAccessToken(oreIdContext: OreIdContext, apiName: string) {
  if (oreIdContext.accessToken) {
    throw new Error(`Missing required header for API ${apiName}: Must have a valid user accessToken`)
  }
}

/** Check that we have an apiKey */
export function assertHasApiKey(oreIdContext: OreIdContext, apiName: string) {
  if (oreIdContext.options?.apiKey) {
    throw new Error(`Missing required header for API ${apiName}: Must have a options.apiKey`)
  }
}

/** Check that an apiKey or accessToken */
export function assertHasServiceKey(oreIdContext: OreIdContext, apiName: string) {
  if (oreIdContext.options?.serviceKey) {
    throw new Error(`Missing required header for API ${apiName}: Must have a options.serviceKey`)
  }
}

/** Check API params for each required param in paramNames */
export function assertParamsHaveRequiredValues(params: JSONObject = {}, paramNames: any[], apiName: string) {
  const missing: any[] = []
  paramNames.forEach(p => {
    if (isNullOrEmpty(params[p])) {
      missing.push(p)
    }
  })
  if (!isNullOrEmpty(missing)) {
    throw new Error(`Missing required parameter(s) for API ${apiName}: ${missing.join(', ')}`)
  }
}

/** Check API params - must include at least one of the params in the list */
export function assertParamsHaveAtLeastOneOfValues(params: JSONObject = {}, paramNames: any[], apiName: string) {
  const matches = paramNames.filter(p => {
    return !isNullOrEmpty(params[p])
  })
  if (matches.length === 0) {
    throw new Error(`Missing at least one of these parameter(s) for API ${apiName}: ${paramNames.join(', ')}`)
  }
}

/** Check API params - must include one and only one of params in the list */
export function assertParamsHaveOnlyOneOfValues(params: JSONObject = {}, paramNames: any[], apiName: string) {
  const matches = paramNames.filter(p => {
    return !isNullOrEmpty(params[p])
  })
  if (matches.length > 1) {
    throw new Error(`You can only provide one of these parameter(s) for API ${apiName}: ${paramNames.join(', ')}`)
  }
}

/** remove processId from data */
export function extractProcessIdFromData(data: any) {
  let processId
  if (data?.processId) {
    processId = data.processId
    // eslint-disable-next-line no-param-reassign
    delete data.processId
  }
  return { data, processId }
}
