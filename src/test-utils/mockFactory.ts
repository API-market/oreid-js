import { JWTToken } from '../auth/models'
import OreIdContext from '../core/IOreidContext'
import { OreIdOptions } from '../core/IOreIdOptions'

export const getToken = () => {
  // Cristy token
  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkM0N0I2NUI4OTNBRTEwN0ExNkE5MTQ0Njk2ODBCMDVEREVGQjFEMjcifQ.eyJpc3MiOiJodHRwczovL29yZWlkLmlvLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAzMzM4NjA1MTg1MDI3NjE2MjAyIiwiYXVkIjpbImh0dHBzOi8vc3RhZ2luZy5zZXJ2aWNlLm9yZWlkLmlvIiwiaHR0cHM6Ly9zdGFnaW5nLnNlcnZpY2Uub3JlaWQuaW8vdXNlcmluZm8iLCJodHRwczovL29yZWlkLmFpa29uLmNvbSIsImh0dHBzOi8vYWlrb24uYXV0aDAuY29tL3VzZXJpbmZvIl0sImF6cCI6InRfNDY4M2FmYzA3NGFiNDQ0ZWJkZjFiZjA4ZWQ4ZDE3NTciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHBob25lIiwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vYXBwSWQiOiJ0XzQ2ODNhZmMwNzRhYjQ0NGViZGYxYmYwOGVkOGQxNzU3IiwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vcHJvdmlkZXIiOiJnb29nbGUiLCJodHRwczovL29yZWlkLmFpa29uLmNvbS9hY2NvdW50Ijoib3JlMXR2dDJhbTJ0IiwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vYWRtaW5TZXJ2aWNlIjoiYWlrb24tYWRtaW4iLCJpYXQiOjE2NTU0MTQ0ODQsImV4cCI6MTY1NTUwMDg4NH0.IUVNDWjNw8mIlMRWN9395-06ILcSrB6UKb23_c9-k5Du1OV-DGUbCKVH0BOnzkOalm2AB9oXSHEnkGMLy0PGeW98CAJ7StYMEkDUk2mtz1oYywpuxnJXX8_nMqLZDemfbju3EHZxrqFdUctbiyf5TLt4Lf7o64bTJ4CqAwfPwlTLvqIj1vdF4Ob7QtnAYwWFg1mpx3XoP8Vnpt9f6kffxJYn0xgoJeUWhvhSQNTR8w9Fxme1PkFv1eY5zw3t0Puuu61gqs6E10avdGjLkyODDCYRN03LfuPADuDOwcJiolR6006XDMjnSgfe_RKAIlUbkMEzWez8zwr_VMUNW1fjdFGZcV4k7OP6ad4S3Lq-wU18QOcuc0HwHX44Ql-CZAHiqqL-QvV8W_T9kNsLXUft9KdQlS0OQihsYjoQyYtgVYlSBt1G9GLE2H8NDho_yingmjRPLkxZXbZgZcyt82hFuHaF7WjzFNvJx-RU9Sa7wmd9pUccMeZwUn1StObJkAtkprdVZHBSTK1H9lxbGFJxubsnRMXdFsqkYPl3WI-_-FYmUomVO0KKlJ3tfPMCicP9TfOp98-5GCz9BrS0so2PzdVN-6em9kOmrgCQ0DM5UKFLlTVVeKdNhXoyE5XFl791YkFqdy_FaZstfRmyOwgeqfjzv8Us6rVzLKIKpx8m_V4'
  const decoed: Partial<JWTToken> = {
    iss: 'https://oreid.io/',
    sub: 'google-oauth2|103338605185027616202',
    //@ts-ignore
    aud: [
      'https://staging.service.oreid.io',
      'https://staging.service.oreid.io/userinfo',
      'https://oreid.aikon.com',
      'https://aikon.auth0.com/userinfo',
    ],
    azp: 't_4683afc074ab444ebdf1bf08ed8d1757',
    scope: 'openid profile email phone',
    'https://oreid.aikon.com/appId': 't_4683afc074ab444ebdf1bf08ed8d1757',
    'https://oreid.aikon.com/provider': 'google',
    'https://oreid.aikon.com/account': 'ore1tvt2am2t',
    'https://oreid.aikon.com/adminService': 'aikon-admin',
    iat: 1655414484,
    exp: 9999999999,
  }

  return { token, decoed }
}

const { token } = getToken()

export const getAccessTokenHelper = () => ({
  subscribe: jest.fn(),
})

export const getLocalState = () => ({ saveAccessToken: jest.fn(), accessToken: token })

export const getOreIdOptions = (): OreIdOptions => ({
  appName: 'testrunner',
  appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
  apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
  // apiKey: 't_k8889ced3cf2b4097a2bec7f90267d172', // has extra rights for examples (serviceKey)
  oreIdUrl: 'http://localhost.com',
  authCallbackUrl: 'http://localhost.com',
  backgroundColor: '#fff',
})

export const createOreIdContext = (): OreIdContext => ({
  accessToken: 'accessToken',
  //@ts-ignore
  accessTokenHelper: getAccessTokenHelper(),
  //@ts-ignore
  localState: getLocalState(),
  options: getOreIdOptions(),
  transitProvidersInstalled: [],
  ualProvidersInstalled: [],
  addAccessTokenAndHmacToUrl: jest.fn(),
  callOreIdApi: jest.fn(),
  getAllChainNetworkSettings: jest.fn(),
  getChainNetworkSettings: jest.fn(),
  logout: jest.fn(),
  setIsBusy: jest.fn(),
  isInitialized: false,
})
