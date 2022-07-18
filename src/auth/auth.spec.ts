/* eslint-disable no-import-assign */
import { createOreIdContext, getToken } from '../test-utils'
import OreIdContext from '../core/IOreidContext'
import { Auth } from './auth'
import { AccessTokenHelper } from './accessTokenHelper'
import Helpers from '../utils/helpers'

import { callApiLoginUserWithToken } from '../api'

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  callApiLoginUserWithToken: jest.fn(),
}))

let auth: Auth
let oreIdContext: OreIdContext

beforeEach(() => {
  const spy = jest.spyOn(Helpers, 'jwtDecodeSafe')
  const myToken = getToken()
  spy.mockImplementation(token => {
    if (token === myToken.token) return myToken.decoed
  })

  // This mock is here to remove unnecessre alerts on tests
  const spyRunAtTime = jest.spyOn(Helpers, 'runAtTime')
  spyRunAtTime.mockImplementation(jest.fn())

  oreIdContext = createOreIdContext()
  auth = new Auth({ oreIdContext })
})

afterEach(() => {
  jest.clearAllMocks()
})

test('Should create auth object', async () => {
  expect(auth).toHaveProperty('_accessTokenHelper')
  expect(auth).toHaveProperty('_localState')
  expect(auth).toHaveProperty('_oreIdContext')
  expect(auth).toHaveProperty('_transitHelper')
})

test('Should did not do a login with invalid token', async () => {
  const token = {}
  await expect(auth.loginWithToken(token)).rejects.toThrowError(
    'Cant loginWithToken - missing required parameter: accessToken OR idToken',
  )
  await expect(auth.loginWithToken({ accessToken: 'accessToken', idToken: 'idToken' })).resolves.toEqual({
    accessToken: null,
    errors: 'token_invalid',
    processId: undefined,
  })
})

test('Should do a login with an token', async () => {
  const { token } = getToken()
  jest.spyOn(AccessTokenHelper.prototype, 'setAccessToken').mockImplementation(() => {
    // do noting
  })
  jest.spyOn(auth, 'user', 'get').mockReturnValue({ getData: jest.fn() } as any)
  ;(callApiLoginUserWithToken as jest.Mock).mockReturnValue({ accessToken: token, processId: '1' })

  const response = await auth.loginWithToken({ idToken: 'idToken', accessToken: token })
  expect(callApiLoginUserWithToken).toBeCalledWith(oreIdContext, { accessToken: token, idToken: 'idToken' })
  expect(response).toEqual({ accessToken: token, processId: '1' })
})

test('Should get login url', async () => {
  // TODO: Implement this test
  expect(1).toBe(1)
})
