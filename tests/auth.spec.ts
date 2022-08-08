import nock from 'nock'
import { getOreId, getOreIdToken, getUser, generateToken } from '../src/test-utils'

afterEach(() => {
  jest.clearAllTimers()
  jest.useRealTimers()
})

afterAll(async () => {
  nock.cleanAll()
})

test('Login user with valid accessToken (issued by ORE ID)', async () => {
  jest.useFakeTimers()
  const accessToken = getOreIdToken()
  const oreId = getOreId()
  const accountName = 'ore1t2swc4zn'
  const userData = getUser(accountName)

  const mockServer = nock('https://service.oreid.io')
  mockServer.post('/api/account/login-user-with-token').reply(200, {
    processId: 'a82e9a02050a',
    account: accountName,
    accessToken,
  })
  mockServer.get(`/api/account/user?account=${accountName}`).reply(200, {
    processId: '889cae07d220',
    ...userData,
  })

  const promise = oreId.auth.loginWithToken({ accessToken })
  jest.advanceTimersByTime(300)
  const response = await promise
  expect(response).toEqual({ accessToken, errors: undefined, processId: 'a82e9a02050a' })
  jest.clearAllTimers()
})

test('Login user with valid idToken (issued by ORE ID)', async () => {
  jest.useFakeTimers()
  const idToken = getOreIdToken()
  const oreId = getOreId()
  const accountName = 'ore1t2swc4zn'
  const userData = getUser(accountName)

  const mockServer = nock('https://service.oreid.io')
  mockServer.post('/api/account/login-user-with-token').reply(200, {
    processId: 'a82e9a02050a',
    account: accountName,
    accessToken: idToken,
  })
  mockServer.get(`/api/account/user?account=${accountName}`).reply(200, {
    processId: '889cae07d220',
    ...userData,
  })
  const promise = oreId.auth.loginWithToken({ idToken })
  jest.advanceTimersByTime(300)
  const response = await promise
  expect(response).toEqual({ accessToken: idToken, errors: undefined, processId: 'a82e9a02050a' })
})

test('Login user with an invalidly signed token (invalided by backend)', async () => {
  jest.useFakeTimers()
  const accessToken = getOreIdToken()
  const oreId = getOreId()

  const mockServer = nock('https://service.oreid.io')
  mockServer
    .post('/api/account/login-user-with-token')
    .reply(400, { processId: '889cae07d220', errorCode: 'tokenInvalid', errorMessage: 'Token invalid or expired' })

  const promise = oreId.auth.loginWithToken({ accessToken })
  jest.advanceTimersByTime(300)
  await expect(promise).rejects.toThrowError('tokenInvalid, Token invalid or expired')
})

test.only('Login user with an third-party token requires api-key', async () => {
  const oreId = getOreId()

  const mockServer = nock('https://service.oreid.io')
  mockServer
    .post('/api/account/login-user-with-token')
    .reply(400, { processId: '889cae07d220', errorCode: 'tokenInvalid', errorMessage: 'Token invalid or expired' })

  const promise = oreId.auth.loginWithToken({
    accessToken: 'xxxxx',
    provider: 'google' as any,
  })
  await expect(promise).rejects.toThrowError('Missing required header for API login-user-with-token: Must have an options.apiKey')

})

test('Login user with an expired token', async () => {
  const accessToken = generateToken({
    iss: 'https://oreid.io/',
    sub: 'google-oauth2|105741711437160993941',
    aud: [
      'https://service.oreid.io',
      'https://service.oreid.io/userinfo',
      'https://oreid.aikon.com',
      'https://aikon.auth0.com/userinfo',
    ],
    azp: 't_4683afc074ab444ebdf1bf08ed8d1757',
    scope: 'openid profile email phone',
    'https://oreid.aikon.com/appId': 't_4683afc074ab444ebdf1bf08ed8d1757',
    'https://oreid.aikon.com/provider': 'google',
    'https://oreid.aikon.com/account': 'ore1t2swc4zn',
    'https://oreid.aikon.com/adminService': 'aikon-admin',
    iat: Math.floor(Date.now() / 1000) - 1000,
    exp: Math.floor(Date.now() / 1000) - 900,
  })
  const oreId = getOreId()
  const accountName = 'ore1t2swc4zn'
  const userData = getUser(accountName)

  const mockServer = nock('https://service.oreid.io')
  mockServer.post('/api/account/login-user-with-token').reply(200, {
    processId: 'a82e9a02050a',
    account: accountName,
    accessToken,
  })
  mockServer.get(`/api/account/user?account=${accountName}`).reply(200, {
    processId: '889cae07d220',
    ...userData,
  })

  const response = await oreId.auth.loginWithToken({ accessToken })

  expect(response).toEqual({ accessToken: null, errors: 'token_invalid', processId: undefined })
})

// (low) Login user with valid accessToken (issued by Google) with appId not configured for accessToken’s azp (clientId) - handled in oreId service backend
// (low) Login user with an invalidly signed token (bad or missing signature)
