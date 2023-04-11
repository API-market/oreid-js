import {
  assertHasAccessToken,
  assertHasApiKey,
  assertHasApiKeyOrAccessToken,
  assertHeaderhasRequiredValues,
  assertParamsHaveAtLeastOneOfValues,
  assertParamsHaveOnlyOneOfValues,
  assertParamsHaveRequiredValues,
  extractProcessIdFromData,
} from './helpers'
import OreIdContext from '../core/IOreidContext'
import { createOreIdContext } from '../test-utils'
import { ApiKeyUsedFor } from '../models'

let oreIdContext: OreIdContext

describe('API helpers', () => {
  test('should not throw an error is all required header values are present', async () => {
    const obj = { test1: 'value', test2: 'value' }
    const names = ['test1', 'test2']
    assertHeaderhasRequiredValues(obj, names, '')
    expect(1).toEqual(1)
  })

  test('should throw error for missing header values', async () => {
    const obj = { test1: 'value' }
    const names = ['test1', 'test2']
    expect(() => assertHeaderhasRequiredValues(obj, names, '')).toThrow(Error)
  })

  test('should not throw an error if access token and api key are given', async () => {
    oreIdContext = createOreIdContext()
    assertHasApiKeyOrAccessToken(oreIdContext, '')
    expect(1).toEqual(1)
  })

  test('should throw error for missing access token and api key', async () => {
    oreIdContext = createOreIdContext()
    delete oreIdContext.accessToken
    delete oreIdContext.options.apiKey
    expect(() => assertHasApiKeyOrAccessToken(oreIdContext, '')).toThrow(Error)
  })

  test('should not throw an error if access token is given', async () => {
    oreIdContext = createOreIdContext()
    assertHasAccessToken(oreIdContext, '')
    expect(1).toEqual(1)
  })

  test('should throw error for missing access token', async () => {
    oreIdContext = createOreIdContext()
    delete oreIdContext.accessToken
    expect(() => assertHasAccessToken(oreIdContext, '')).toThrow(Error)
  })

  test('should not throw an error if api key is provided', async () => {
    oreIdContext = createOreIdContext()
    assertHasApiKey(oreIdContext, ApiKeyUsedFor.AccountMigration, '')
    expect(1).toEqual(1)
  })

  test('should throw error for missing api key', async () => {
    oreIdContext = createOreIdContext()
    delete oreIdContext.options.apiKey
    expect(() => assertHasApiKey(oreIdContext, ApiKeyUsedFor.AccountMigration, '')).toThrow(Error)
  })

  test('should not throw an error if all paramater values are found', async () => {
    const obj = { test1: 'value', test2: 'value' }
    const names = ['test1', 'test2']
    assertParamsHaveRequiredValues(obj, names, '')
    expect(1).toEqual(1)
  })

  test('should throw error for missing paramater values', async () => {
    const obj = { test1: 'value' }
    const names = ['test1', 'test2']
    expect(() => assertParamsHaveRequiredValues(obj, names, '')).toThrow(Error)
  })

  test('should not throw an error if at least one paramater value is found', async () => {
    const obj = { test1: 'value', test2: 'value' }
    const names = ['test2']
    assertParamsHaveAtLeastOneOfValues(obj, names, '')
    expect(1).toEqual(1)
  })

  test('should throw error if no required paramater values are provided', async () => {
    const obj = { test1: 'value', test3: 'value', test4: 'value' }
    const names = ['test2']
    expect(() => assertParamsHaveAtLeastOneOfValues(obj, names, '')).toThrow(Error)
  })

  test('should not throw an error if only one paramater value is found from the given', async () => {
    const obj = { test1: 'value', test4: 'value' }
    const names = ['test1', 'test3']
    assertParamsHaveOnlyOneOfValues(obj, names, '')
    expect(1).toEqual(1)
  })

  test('should throw error if more than one required paramater values is provided', async () => {
    const obj = { test1: 'value', test3: 'value', test4: 'value' }
    const names = ['test1', 'test3']
    expect(() => assertParamsHaveOnlyOneOfValues(obj, names, '')).toThrow(Error)
  })

  test('should remove processId from data', async () => {
    const input = { test1: 'value', processId: 'processId' }
    const { data, processId } = extractProcessIdFromData(input)
    expect(data).toEqual({ test1: 'value' })
    expect(processId).toEqual('processId')
  })
})
