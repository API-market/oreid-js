import { ApiGetAppTokenParams, callApiGetAppToken } from './appToken'
import {
  ApiEndpoint,
  AppAccessTokenMetadata,
  RequestType,
  ApiKeyUsedFor,
  NewAccountAppTokenParams,
  AccountType,
} from '../../models'
import { assertHasApiKey } from '../helpers'
import Helpers from '../../utils/helpers'
import * as helpers from '../helpers'
import OreIdContext from '../../core/IOreidContext'
import { createOreIdContext } from '../../test-utils'

function isApiGetAppTokenParams(obj: any): obj is ApiGetAppTokenParams {
  return 'appAccessTokenMetadata' in obj && typeof obj.appAccessTokenMetadata === 'object'
}

const aatmd: AppAccessTokenMetadata = {}

const agatp: ApiGetAppTokenParams = {
  appAccessTokenMetadata: aatmd,
}

describe('Api Get App Token Params type', () => {
  test('type can be instantiated', () => {
    expect(isApiGetAppTokenParams(agatp)).toBeTruthy()
  })
})

let oreIdContext: OreIdContext

beforeEach(() => {
  oreIdContext = createOreIdContext()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Get app token', () => {
  test('should return a valid response', async () => {
    const tpNullOrEmpty = jest.spyOn(Helpers, 'isNullOrEmpty')
    const tpSpyReqdParams = jest.spyOn(helpers, 'assertHasApiKey')
    const tpSpyApiCall = jest.spyOn(oreIdContext, 'callOreIdApi')
    const resultValue = { appAccessToken: 'appAccessToken value' }
    tpSpyApiCall.mockReturnValue(resultValue as unknown as Promise<string>)
    expect(tpNullOrEmpty).not.toBeCalled()
    expect(tpSpyReqdParams).not.toBeCalled()
    expect(tpSpyApiCall).not.toBeCalled()
    const result: string = await callApiGetAppToken(oreIdContext, agatp)
    expect(tpNullOrEmpty).toBeCalledWith(agatp.appAccessTokenMetadata)
    expect(tpSpyReqdParams).toBeCalledWith(oreIdContext, null, ApiEndpoint.AppToken)
    expect(tpSpyApiCall).toBeCalled()
    expect(result).toEqual('appAccessToken value')
  })
})
