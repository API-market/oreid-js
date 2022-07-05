import { OreIdOptions } from '../core/IOreIdOptions'
import OreId from './oreId'
import Transaction from '../transaction/transaction'
import { callApiCustodialNewAccount, callApiCustodialMigrateAccount } from '../api'
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  callApiCustodialMigrateAccount: jest.fn(),
  callApiCustodialNewAccount: jest.fn(),
}))

jest.mock('../transaction/transaction')

// use factories as this is good to ensure that the values are these, and that the tests do not change the values
const getOptions = (): OreIdOptions => ({
  appName: 'testrunner',
  appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
  apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
  // apiKey: 't_k8889ced3cf2b4097a2bec7f90267d172', // has extra rights for examples (serviceKey)
  oreIdUrl: 'http://localhst',
  authCallbackUrl: 'http://localhost.com',
  backgroundColor: '#fff',
})

let oreId: OreId

beforeEach(() => {
  oreId = new OreId(getOptions())
  jest.clearAllMocks()
})

test('Should do a logout', () => {
  const spy = jest.spyOn(oreId.auth, 'logout')

  expect(spy).not.toBeCalled()
  oreId.logout()
  expect(spy).toBeCalled()
})

describe('Network and ChainNetwork functions', () => {
  test('getAllChainNetworkSettings', () => {
    // @ts-ignore
    const spy = jest.spyOn(oreId._settings, 'getAllChainNetworkSettings')
    spy.mockResolvedValue(null)

    expect(spy).not.toBeCalled()
    oreId.getAllChainNetworkSettings()
    expect(spy).toBeCalled()
  })

  test('getChainNetworkSettings', () => {
    // @ts-ignore
    const spy = jest.spyOn(oreId._settings, 'getChainNetworkSettings')
    spy.mockResolvedValue(null)

    expect(spy).not.toBeCalled()
    oreId.getChainNetworkSettings('my-chain-network' as any)
    expect(spy).toBeCalledWith('my-chain-network')
  })

  test('getChainNetworkByChainId', async () => {
    const setting = {
      network: 'network',
      hosts: [{ chainId: 'chainId' }],
    }
    // @ts-ignore
    const spy = jest.spyOn(oreId._settings, 'getAllChainNetworkSettings')
    spy.mockResolvedValue([setting] as any)

    const chain = await oreId.getChainNetworkByChainId('chainId')
    expect(chain).toBe(setting.network)

    const notChain = await oreId.getChainNetworkByChainId('Not-chainId')
    expect(notChain).toBeNull()
  })
})

describe('custodial Custodial Account', () => {
  test('custodialNewAccount', async () => {
    const responseValue = { response: 'response' }
    ;(callApiCustodialNewAccount as jest.Mock).mockResolvedValue(responseValue)
    expect(callApiCustodialNewAccount).not.toBeCalled()
    const response = await oreId.custodialNewAccount({ param: 'my-option' } as any)
    expect(callApiCustodialNewAccount).toBeCalledWith(oreId, { param: 'my-option' })
    expect(response).toEqual(responseValue)
  })

  test('custodialMigrateAccount', async () => {
    const responseValue = { response: 'response' }
    ;(callApiCustodialMigrateAccount as jest.Mock).mockResolvedValue(responseValue)
    expect(callApiCustodialMigrateAccount).not.toBeCalled()
    const response = await oreId.custodialMigrateAccount({ param: 'my-option' } as any)
    expect(callApiCustodialMigrateAccount).toBeCalledWith(oreId, { param: 'my-option' })
    expect(response).toEqual(responseValue)
  })
})

describe('Transaction', () => {
  test('createTransaction', async () => {
    //@ts-ignore
    jest.spyOn(oreId._auth.user, 'hasData', 'get').mockReturnValue(true)
    const transactionReturn = { param: 'return' }
    ;(Transaction as jest.Mock).mockReturnValue(transactionReturn)

    expect(Transaction).not.toBeCalled()
    const transactionData = { param: 'my-params' }
    const result = await oreId.createTransaction(transactionData as any)

    expect(result).toEqual(transactionReturn)
    expect(Transaction).toBeCalledWith({ oreIdContext: oreId, user: expect.any(Object), data: transactionData })
  })
})
