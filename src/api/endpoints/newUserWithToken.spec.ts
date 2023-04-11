import { ApiNewUserWithTokenParams, ApiNewUserWithTokenBodyParams, callApiNewUserWithToken } from './newUserWithToken'
import { ApiEndpoint, ApiMessageResult, ApiResultWithErrorCode, AuthProvider } from '../../models'
import * as helpers from '../helpers'
import OreIdContext from '../../core/IOreidContext'
import { createOreIdContext } from '../../test-utils'

function isApiNewUserWithTokenParams(obj: any): obj is ApiNewUserWithTokenParams {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'abc' &&
    'delayWalletSetup' in obj &&
    obj.delayWalletSetup &&
    'isTestUser' in obj &&
    obj.isTestUser &&
    'idToken' in obj &&
    obj.idToken === 'def' &&
    'provider' in obj &&
    obj.provider === 'custodial'
  )
}

const anuwtp: ApiNewUserWithTokenParams = {
  accessToken: 'abc',
  delayWalletSetup: true,
  isTestUser: true,
  idToken: 'def',
  provider: AuthProvider.Custodial,
}

const anuwtpNoId: ApiNewUserWithTokenParams = {
  accessToken: 'abc',
  provider: AuthProvider.Custodial,
}

const anuwtpNoToken: ApiNewUserWithTokenParams = {
  idToken: 'def',
}

const anuwtpIdAndToken: ApiNewUserWithTokenParams = {
  accessToken: 'abc',
  provider: AuthProvider.Custodial,
}

const anuwtpNoProvider: ApiNewUserWithTokenParams = {
  accessToken: 'abc',
  provider: null,
}

describe('Api New User With Token Params type', () => {
  test('type can be instantiated', () => {
    expect(isApiNewUserWithTokenParams(anuwtp)).toBeTruthy()
  })
})

function isApiNewUserWithTokenBodyParams(obj: any): obj is ApiNewUserWithTokenBodyParams {
  return (
    'access_token' in obj &&
    obj.access_token === 'access_token value' &&
    'delay_wallet_setup' in obj &&
    obj.delay_wallet_setup &&
    'is_test_user' in obj &&
    obj.is_test_user &&
    'id_token' in obj &&
    obj.id_token === 'id_token value' &&
    'provider' in obj &&
    obj.provider === 'provider value'
  )
}

const anuwtbp: ApiNewUserWithTokenBodyParams = {
  access_token: 'access_token value',
  delay_wallet_setup: true,
  is_test_user: true,
  id_token: 'id_token value',
  provider: 'provider value',
}

describe('Api New User With Token Body Params', () => {
  test('type can be instantiated', () => {
    expect(isApiNewUserWithTokenBodyParams(anuwtbp)).toBeTruthy()
  })
})

let oreIdContext: OreIdContext

beforeEach(() => {
  oreIdContext = createOreIdContext()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Add new user with id token but no access token', () => {
  test('should return a valid access token', async () => {
    const tpSpyAtLeastOneValue = jest.spyOn(helpers, 'assertParamsHaveAtLeastOneOfValues')
    const tpSpyOnlyOneValue = jest.spyOn(helpers, 'assertParamsHaveOnlyOneOfValues')
    const tpSpyReqdValues = jest.spyOn(helpers, 'assertParamsHaveRequiredValues')
    const tpSpyHasAPIKey = jest.spyOn(helpers, 'assertHasApiKey')
    const tpSpyApiCall = jest.spyOn(oreIdContext, 'callOreIdApi')
    const resultValue = { accessToken: '', idToken: '' }

    tpSpyApiCall.mockReturnValue(resultValue as unknown as Promise<{ accessToken: string } & ApiResultWithErrorCode>)
    expect(tpSpyAtLeastOneValue).not.toBeCalled()
    expect(tpSpyOnlyOneValue).not.toBeCalled()
    expect(tpSpyReqdValues).not.toBeCalled()
    expect(tpSpyHasAPIKey).not.toBeCalled()
    expect(tpSpyApiCall).not.toBeCalled()

    const result = await callApiNewUserWithToken(oreIdContext, anuwtpNoToken)

    expect(tpSpyAtLeastOneValue).toBeCalledWith(anuwtpNoToken, ['idToken', 'accessToken'], ApiEndpoint.NewUserWithToken)
    expect(tpSpyOnlyOneValue).toBeCalledWith(anuwtpNoToken, ['idToken', 'provider'], ApiEndpoint.NewUserWithToken)
    expect(tpSpyReqdValues).not.toBeCalled()
    expect(tpSpyHasAPIKey).not.toBeCalled()
    expect(tpSpyApiCall).toBeCalled()

    expect(result).toBeTruthy()
    expect(result.accessToken).toBeDefined()
    //expect(result.idToken).toBeDefined()
    expect(result).toEqual(resultValue)
  })
})

describe('Add new user with access token but no id token', () => {
  test('should return a valid access token', async () => {
    const tpSpyAtLeastOneValue = jest.spyOn(helpers, 'assertParamsHaveAtLeastOneOfValues')
    const tpSpyOnlyOneValue = jest.spyOn(helpers, 'assertParamsHaveOnlyOneOfValues')
    const tpSpyReqdValues = jest.spyOn(helpers, 'assertParamsHaveRequiredValues')
    const tpSpyHasAPIKey = jest.spyOn(helpers, 'assertHasApiKey')
    const tpSpyApiCall = jest.spyOn(oreIdContext, 'callOreIdApi')
    const resultValue = { accessToken: '', idToken: '' }

    tpSpyApiCall.mockReturnValue(resultValue as unknown as Promise<{ accessToken: string } & ApiResultWithErrorCode>)
    expect(tpSpyAtLeastOneValue).not.toBeCalled()
    expect(tpSpyOnlyOneValue).not.toBeCalled()
    expect(tpSpyReqdValues).not.toBeCalled()
    expect(tpSpyHasAPIKey).not.toBeCalled()
    expect(tpSpyApiCall).not.toBeCalled()

    const result = await callApiNewUserWithToken(oreIdContext, anuwtpNoId)

    expect(tpSpyAtLeastOneValue).toBeCalledWith(anuwtpNoId, ['idToken', 'accessToken'], ApiEndpoint.NewUserWithToken)
    expect(tpSpyOnlyOneValue).toBeCalledWith(anuwtpNoId, ['idToken', 'provider'], ApiEndpoint.NewUserWithToken)
    expect(tpSpyReqdValues).toBeCalledWith(anuwtpNoId, ['accessToken', 'provider'], ApiEndpoint.NewUserWithToken)
    expect(tpSpyHasAPIKey).toBeCalledWith(oreIdContext, null, 'new-user-with-token')
    expect(tpSpyApiCall).toBeCalled()

    expect(result).toBeTruthy()
    expect(result.accessToken).toBeDefined()
    //expect(result.idToken).toBeDefined()
    expect(result).toEqual(resultValue)
  })
})

describe('Add new user with access token and id token', () => {
  test('should return a valid access token', async () => {
    const tpSpyAtLeastOneValue = jest.spyOn(helpers, 'assertParamsHaveAtLeastOneOfValues')
    const tpSpyOnlyOneValue = jest.spyOn(helpers, 'assertParamsHaveOnlyOneOfValues')
    const tpSpyReqdValues = jest.spyOn(helpers, 'assertParamsHaveRequiredValues')
    const tpSpyHasAPIKey = jest.spyOn(helpers, 'assertHasApiKey')
    const tpSpyApiCall = jest.spyOn(oreIdContext, 'callOreIdApi')
    const resultValue = { accessToken: '', idToken: '' }

    tpSpyApiCall.mockReturnValue(resultValue as unknown as Promise<{ accessToken: string } & ApiResultWithErrorCode>)
    expect(tpSpyAtLeastOneValue).not.toBeCalled()
    expect(tpSpyOnlyOneValue).not.toBeCalled()
    expect(tpSpyReqdValues).not.toBeCalled()
    expect(tpSpyHasAPIKey).not.toBeCalled()
    expect(tpSpyApiCall).not.toBeCalled()

    const result = await callApiNewUserWithToken(oreIdContext, anuwtpIdAndToken)

    expect(tpSpyAtLeastOneValue).toBeCalledWith(
      anuwtpIdAndToken,
      ['idToken', 'accessToken'],
      ApiEndpoint.NewUserWithToken,
    )
    expect(tpSpyOnlyOneValue).toBeCalledWith(anuwtpIdAndToken, ['idToken', 'provider'], ApiEndpoint.NewUserWithToken)
    expect(tpSpyReqdValues).toBeCalledWith(anuwtpIdAndToken, ['accessToken', 'provider'], ApiEndpoint.NewUserWithToken)
    expect(tpSpyApiCall).toBeCalled()

    expect(result).toBeTruthy()
    expect(result.accessToken).toBeDefined()
    //expect(result.idToken).toBeDefined()
    expect(result).toEqual(resultValue)
  })
})

describe('Add new user with access token but no provider', () => {
  test('should return an error stating that a provider must be provided', async () => {
    const tpSpyAtLeastOneValue = jest.spyOn(helpers, 'assertParamsHaveAtLeastOneOfValues')

    // eslint-disable-next-line jest/valid-expect-in-promise
    callApiNewUserWithToken(oreIdContext, anuwtpNoProvider).catch(() => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(tpSpyAtLeastOneValue).toThrowError()
    })
  })
})
