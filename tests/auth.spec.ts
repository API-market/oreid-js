import nock from 'nock'
import { getOreId, getOreIdToken, getUser, generateToken } from './utils'

afterAll(async () => {
  nock.cleanAll()
})

test('Login user with valid accessToken (issued by ORE ID)', async () => {
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

  const response = await oreId.auth.loginWithToken({ accessToken })

  expect(response).toEqual({ accessToken, errors: undefined, processId: 'a82e9a02050a' })
})

test('Login user with valid idToken (issued by ORE ID)', async () => {
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
  const response = await oreId.auth.loginWithToken({ idToken })

  expect(response).toEqual({ accessToken: idToken, errors: undefined, processId: 'a82e9a02050a' })
})

test('Login user with an invalidly signed token (invalided by backend)', async () => {
  const accessToken = getOreIdToken()
  const oreId = getOreId()

  const mockServer = nock('https://service.oreid.io')
  mockServer
    .post('/api/account/login-user-with-token')
    .reply(400, { processId: '889cae07d220', errorCode: 'tokenInvalid', errorMessage: 'Token invalid or expired' })

  await expect(oreId.auth.loginWithToken({ accessToken })).rejects.toThrowError(
    'tokenInvalid, Token invalid or expired',
  )
})

// ! This test caught wrong behavior
test('Login user with an invalidly signed token (bad token)', async () => {
  const oreId = getOreId()

  const mockServer = nock('https://service.oreid.io')
  mockServer
    .post('/api/account/login-user-with-token')
    .reply(400, { processId: '889cae07d220', errorCode: 'tokenInvalid', errorMessage: 'Token invalid or expired' })

  // ! In this test the token is corrupted. I deleted some characters in the middle, to make sure the token is invalid.
  // ! The desired behavior is for an exception to be thrown, but that is not what is happening. The promise is fulfilled with an error response.

  await expect(
    oreId.auth.loginWithToken({
      accessToken:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkM0N0I2NUI4OTNBRTEwN0ExNkE5MTQ0Njk2ODBCMDVEREVGQjFEMjcifQ.eyJpc3MiOiJodHRwczovL29yZWlkLmlvzExNDM3MTYwOTkRhZ2luZy5zZXJ2aWNlLm9yZWlkLmlvIiwiaHR0cHM6Ly9zdGFnaW5nLnNlcnZpY2Uub3JlaWQuaW8vdXNlcmluZm8iLCJodHRwczovL29yZWlkLmFpa29uLmNvbSIsImh0dHBzOi8vYWlrb24uYXV0aDAuY29tL3VzZXJpbmZvIl0sImF6cCI6InRfNDY4M2FmYzA3NGFiNDQ0ZWJkZjFiZjA4ZWQ4ZDE3NTciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHBob25lIiwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vYXBwSWQiOiJ0XzQ2ODNhZmMwNzRhYjQ0NGViZGYxYmYwOGVkOGQxNzU3IiwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vcHJvdmlkZXIiOiJnb29nbGUiLCJodHRwczovL29yZWlkLmFpa29uLmNvbS9hY2NvdW50Ijoib3JlMXQyc3djNHpuIiwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vYWRtaW5TZXJ2aWNlIjoiYWlrb24tYWRtaW4iLCJpYXQiOjE2NTYzNDY3NzQsImV4cCI6MTY1NjM0NzI3NH0=.skA5HUFqxaTt2lLRKKbIl4OgvcD7iczNvZeWQXr2nKWb7kVUVWYSLLxDTqanfveALQ9YEQgo4OJnFRZ6CMSlJFQfDWPCk2YZJuIi4BOOWsN8aTuwdoD8Z6ZQWmwnCWMpMKFzVQE_ui75DST8dQAB7guR4Hk2iC5FJOmUkn_oJodMJDc3OML0xWbdrnYH2K5r4Rjq5E6X7Nqu9uHf3uZE9EhGMJOIuaBbR9ft34CEEOCA9Mzdmp0XGsc8AKrscfRDpNJsP6SP3sdOml0K-ZfSB30Ssbz_DKAzTrz5WrOCQ67FBNvpBYDsIjEt607dNMZncyYwzHB5aT2Aob7yla7JaA',
    }),
  ).rejects.toThrowError('tokenInvalid, Token invalid or expired')
})

// ! This test caught wrong behavior
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

  await expect(oreId.auth.loginWithToken({ accessToken })).rejects.toThrowError(
    'tokenInvalid, Token invalid or expired',
  )
})

// (low) Login user with valid accessToken (issued by Google) with appId not configured for accessToken’s azp (clientId) - handled in oreId service backend
// (low) Login user with an invalidly signed token (bad or missing signature)
