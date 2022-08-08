import { getToken } from '../test-utils'
import { AccessTokenHelper } from './accessTokenHelper'
import Helpers from '../utils/helpers'

beforeEach(() => {
  const spy = jest.spyOn(Helpers, 'jwtDecodeSafe')
  const myToken = getToken()
  // eslint-disable-next-line consistent-return
  spy.mockImplementation(token => {
    if (token === myToken.token) return myToken.decoed
  })

  // This mock is here to remove unnecessre alerts on tests
  const spyRunAtTime = jest.spyOn(Helpers, 'runAtTime')
  spyRunAtTime.mockImplementation(jest.fn())
})

afterEach(() => {
  jest.resetAllMocks()
})

test('Should create accessTokenHelper', async () => {
  const { token, decoed } = getToken()
  const accessTokenHelper = new AccessTokenHelper(token)

  expect(accessTokenHelper).toHaveProperty('_accessToken', token)
  expect(accessTokenHelper).toHaveProperty('_decodedAccessToken', decoed)
})

test('Should set and clear token', async () => {
  const { token } = getToken()
  const accessTokenHelper = new AccessTokenHelper(token)

  expect(accessTokenHelper).toHaveProperty('_accessToken', token)
  accessTokenHelper.clearAccessToken()
  expect(accessTokenHelper).toHaveProperty('_accessToken', null)
  accessTokenHelper.setAccessToken(token)
  expect(accessTokenHelper).toHaveProperty('_accessToken', token)
})

test('Should clear token', async () => {
  const { token } = getToken()
  const accessTokenHelper = new AccessTokenHelper(token)

  expect(accessTokenHelper).toHaveProperty('_accessToken', token)
  accessTokenHelper.clearAccessToken()
  expect(accessTokenHelper).toHaveProperty('_accessToken', null)
})

// TODO: IdToken test (I didn't understand what this tokenId is, and that's why I don't know how to test it)

describe('static function: assertIsTokenValid', () => {
  test('Should trow error on "empty" token', async () => {
    const error = new Error('JWT (access or id) token is invalid, or expired)')
    expect(() => AccessTokenHelper.assertIsTokenValid(null)).toThrow(error)
    expect(() => AccessTokenHelper.assertIsTokenValid('' as any)).toThrow(error)
    expect(() => AccessTokenHelper.assertIsTokenValid(undefined)).toThrow(error)
  })

  test('Should trow error on invalid token', async () => {
    const { decoed } = getToken()
    expect(() => AccessTokenHelper.assertIsTokenValid({ ...decoed, iss: ['not-oreid.io'] } as any)).toThrow(
      new Error('Access token not issued by ORE ID'),
    )
  })

  test('Should call "isTokenDateValidNow" on token', async () => {
    const { decoed } = getToken()
    expect(() => AccessTokenHelper.assertIsTokenValid({ ...decoed, exp: 1655414484 })).toThrow(
      new Error('Access token has expired'),
    )
    expect(() => AccessTokenHelper.assertIsTokenValid(decoed)).not.toThrow()
  })
})

describe('static function: isTokenValid', () => {
  // TODO: implement tests
  test('implement all relevant test scenarios', async () => {
    expect(true).toBe(true)
  })
})

describe('static function: assertIdTokenMatchesAccessToken', () => {
  // TODO: implement tests
  test('implement all relevant test scenarios', async () => {
    expect(true).toBe(true)
  })
})

describe('static function: isTokenDateValidNow', () => {
  // TODO: implement tests
  test('implement all relevant test scenarios', async () => {
    expect(true).toBe(true)
  })
})
