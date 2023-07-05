import { OreIdOptions } from '../core/IOreIdOptions'
import OreId from './oreId'
import { callApiCustodialNewAccount, callApiCustodialMigrateAccount, callApiValidateTransaction } from '../api'
import { ChainNetwork, TransactionData, UserChainAccount, UserData } from '../models'

const payerErrorMessage = 'a low resource error message'
const validationErrorMessage = 'a error message'

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  callApiCustodialMigrateAccount: jest.fn(),
  callApiCustodialNewAccount: jest.fn(),
  callApiValidateTransaction: jest.fn().mockImplementation(() => Promise.resolve(
    {
      isValid: false, errorMessage: validationErrorMessage, 
      fees: {
        chainSupportsFees: true,
        feesByPriority: [
          { 
            priority: "low",
            fee: "0",
          }
        ]
      }
    },
  )),
  callApiValidatePayerTransaction: jest.fn().mockImplementation(() => Promise.resolve(
    {
    resources: {
      chainSupportsResources: true,
      resourcesRequired: true,
      resourceEstimationType: "exact",
      lowResourceErrorMessages: [payerErrorMessage],
    },  
    fees: {
      chainSupportsFees: true,
      feesByPriority: [
        { 
          priority: "low",
          fee: "0",
          lowFeeErrorMessage: "balance available is 0" 
        }
      ],
    }}
  )),
}))


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
    oreId.settings.getAllChainNetworkSettings()
    expect(spy).toBeCalled()
  })

  test('getChainNetworkSettings', () => {
    // @ts-ignore
    const spy = jest.spyOn(oreId._settings, 'getChainNetworkSettings')
    spy.mockResolvedValue(null)

    expect(spy).not.toBeCalled()
    oreId.settings.getChainNetworkSettings('my-chain-network' as any)
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

    const chain = await oreId.settings.getChainNetworkByChainId('chainId')
    expect(chain).toBe(setting.network)

    const notChain = await oreId.settings.getChainNetworkByChainId('Not-chainId')
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

describe('Create new Transaction with createTransaction', () => {
  const userChainAccount: UserChainAccount = {
    chainNetwork: ChainNetwork.AlgoBeta,
    chainAccount: 'chainAccount',
    defaultPermission: { name: 'active' },
    permissions: [{ name: 'active' }],
  }

  const userData: UserData = {
    chainAccounts: [userChainAccount],
    email: 'email',
    name: 'name',
    username: 'username',
    picture: 'picture',
    accountName: 'accountName',
  }

  const transactionData : TransactionData = {
    account: 'accountName',
    chainAccount: 'chainAccount',
    chainNetwork: ChainNetwork.AlgoBeta,
    transaction: {"actions":[{"from":"HRFT6WNEDH5LAN4JTUQIVYFHPZB7JUMPHGIYZZZOMOKBHHUV4HGEFF3JFA","to":"TM4HSPWPRUHEHBVVAYGX3YQTQG5KSEZ4OMAN6NPGELNPYOB7SYEA2PODTQ","amount":1000000,"note":"Hello World"}]}
  }

  beforeEach(() => {
    jest.spyOn(oreId.auth.user, 'getData').mockResolvedValue(userData)
    jest.spyOn(oreId.auth.user, 'hasData', 'get').mockReturnValue(true)
    jest.spyOn(oreId.auth.user, 'accountName', 'get').mockReturnValue('accountName')
  })
  
  test('createTransaction should not throw but fill error fields on validation failure when doesNotThrow is true', async () => {
    const result = await oreId.createTransaction(transactionData, true)
    
    expect(result.validationData).toBeDefined();
    expect(result.validationData.isValid).toBeFalsy();
    expect(result.validationError).toBe('a error message');
    expect(result.payerErrors).toContain('balance available is 0');
    expect(result.payerErrors).toContain('a low resource error message');
  })

  test('createTransaction should throw an error on data validation failure when doesNotThrow is set to false', async () => {
    try{
      await oreId.createTransaction(transactionData, false)
    }
    catch(error){
      // doesNotThrow is false by default
      expect(error.message).toBe(`Validation error: ${validationErrorMessage}`);
    }
  })

  test('createTransaction should throw an error on a payer validation failure when doesNotThrow is set to false', async () => {
    (callApiValidateTransaction as jest.Mock).mockImplementationOnce(() => Promise.resolve(
      {
        isValid: true
      }
    ));

    try{
      // doesNotThrow is false by default
      await oreId.createTransaction(transactionData)
    }
    catch(error){
      expect(error.message).toBe(`Fee or Resource error: ${payerErrorMessage}`);
    }
  })
})
