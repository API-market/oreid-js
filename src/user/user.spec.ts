import { User } from './user'
import * as helpers from '../api/helpers'
import OreIdContext from '../core/IOreidContext'
import { createOreIdContext, getToken } from '../test-utils'
import TransitHelper from '../transit/TransitHelper'
import UalHelper from '../ual/UalHelper'
import { AccessTokenHelper } from '../auth/accessTokenHelper'

let oreIdContext: OreIdContext

beforeEach(() => {
  jest.clearAllMocks()
  oreIdContext = createOreIdContext()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('User', () => {
  test('should create a valid user', () => {
    return new Promise<void>(done => {
      const { token, decoed } = getToken()
      const accessTokenHelper = new AccessTokenHelper(token)

      const user = new User({
        oreIdContext: oreIdContext,
        accessTokenHelper,
        accountName: 'accountName value',
      })
      user.subscribe(result => {
        console.log(`result: ${JSON.stringify(result)}`)
        expect(result).toEqual('accountName value')
        done()
      })
    })
  })
})
