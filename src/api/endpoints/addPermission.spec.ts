import { ApiAddPermissionParams, callApiAddPermission } from './addPermission'
import { ApiEndpoint, ApiMessageResult, ChainNetwork, ExternalWalletType } from '../../models'
import * as helpers from '../helpers'
import OreIdContext from '../../core/IOreidContext'
import { createOreIdContext } from '../../test-utils'

function isApiAddPermissionParams(obj: any): obj is ApiAddPermissionParams {
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'parentPermission' in obj &&
    obj.parentPermission === 'geolocation' &&
    'permission' in obj &&
    obj.permission === 'geolocation' &&
    'provider' in obj &&
    obj.provider === 'algosigner' &&
    'publicKey' in obj &&
    obj.publicKey === 'publicKey value'
  )
}

const aapp: ApiAddPermissionParams = {
  account: 'account value',
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoBeta,
  parentPermission: 'geolocation',
  permission: 'geolocation',
  provider: ExternalWalletType.AlgoSigner,
  publicKey: 'publicKey value',
}

describe('Api Add Permission Params type', () => {
  test('type can be instantiated', () => {
    expect(isApiAddPermissionParams(aapp)).toBeTruthy()
  })
})

let oreIdContext: OreIdContext

beforeEach(() => {
  oreIdContext = createOreIdContext()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Add API permission', () => {
  test('should return a valid response', async () => {
    const tpSpyKeyOrToken = jest.spyOn(helpers, 'assertHasApiKeyOrAccessToken')
    const tpSpyReqdParams = jest.spyOn(helpers, 'assertParamsHaveRequiredValues')
    const tpSpyApiCall = jest.spyOn(oreIdContext, 'callOreIdApi')
    const resultValue: ApiMessageResult = { success: 'true' }
    tpSpyApiCall.mockReturnValue(resultValue as Promise<ApiMessageResult>)
    expect(tpSpyKeyOrToken).not.toBeCalled()
    expect(tpSpyReqdParams).not.toBeCalled()
    expect(tpSpyApiCall).not.toBeCalled()
    const result: ApiMessageResult = await callApiAddPermission(oreIdContext, aapp)
    expect(tpSpyKeyOrToken).toBeCalledWith(oreIdContext, ApiEndpoint.AddPermission)
    expect(tpSpyApiCall).toBeCalled()
    expect(result).toBeTruthy()
    expect(result.success).toBeDefined()
    expect(result.success).toEqual('true')
  })
})
