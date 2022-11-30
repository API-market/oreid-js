import WalletHelper from './WalletHelper'
import OreIdContext from '../core/IOreidContext'
import TransitHelper from '../transit/TransitHelper'
import UalHelper from '../ual/UalHelper'
import { RequestType, ApiEndpoint } from '../api'
import { AppAccessTokenMetadata } from '../core/models'
import { ExternalWalletInterface, ExternalWalletType } from '../models'
import { externalWalletsNotImplemented } from '../constants'
import { IAM } from 'aws-sdk'

let walletHelper: WalletHelper

const oreIdContext: OreIdContext = {
  accessToken: undefined,
  accessTokenHelper: undefined,
  localState: undefined,
  options: undefined,
  transitProvidersInstalled: [],
  ualProvidersInstalled: [],
  addAccessTokenAndHmacToUrl: undefined,
  callOreIdApi: undefined,
  settings: undefined,
  logout: function (): void {},
  setIsBusy: function (value: boolean): void {},
  isInitialized: false,
  walletHelper: undefined,
}

const transitHelper: TransitHelper = new TransitHelper({ oreIdContext: null, user: null })
const ualHelper: UalHelper = new UalHelper({ oreIdContext: null, user: null })

beforeEach(() => {
  walletHelper = new WalletHelper({ oreIdContext, transitHelper, ualHelper })
  jest.clearAllMocks()
})

test('Should get the given transit helper', () => {
  expect(walletHelper.transitHelper).toEqual(transitHelper)
})

test('Should get the given ual helper', () => {
  expect(walletHelper.ualHelper).toEqual(ualHelper)
})

describe('Wallet types', () => {
  test('should give an expected result for a given transit provider wallet type', () => {
    const tpSpy = jest.spyOn(walletHelper._transitHelper, 'isTransitProvider')
    tpSpy.mockReturnValue(true)
    expect(tpSpy).not.toBeCalled()
    const result = walletHelper.isAValidExternalWalletType(ExternalWalletType.AlgoSigner)
    expect(tpSpy).toBeCalledWith('algosigner')
    expect(result).toBeTruthy()
  })

  test('should give an expected result for a given ual provider wallet type', () => {
    const tpSpy = jest.spyOn(walletHelper._transitHelper, 'isTransitProvider')
    const ualSpy = jest.spyOn(walletHelper._ualHelper, 'isUalProvider')
    tpSpy.mockReturnValue(false)
    ualSpy.mockReturnValue(true)
    expect(tpSpy).not.toBeCalled()
    expect(ualSpy).not.toBeCalled()
    const result = walletHelper.isAValidExternalWalletType(ExternalWalletType.AlgoSigner)
    expect(tpSpy).toBeCalledWith('algosigner')
    expect(ualSpy).toBeCalledWith('algosigner')
    expect(result).toBeTruthy()
  })

  test('should give an expected result for a given external provider wallet type', () => {
    const tpSpy = jest.spyOn(walletHelper._transitHelper, 'isTransitProvider')
    tpSpy.mockReturnValue(true)
    expect(tpSpy).not.toBeCalled()
    const result = walletHelper.isAValidExternalWalletType(ExternalWalletType.Metro)
    expect(tpSpy).toBeCalledWith('metro')
    expect(result).toBeFalsy()
  })
})

describe('Wallet information', () => {
  test('should throw an error if the wallet type is not valid', () => {
    // const validSpy = jest.spyOn(walletHelper, 'isAValidExternalWalletType')
    // validSpy.mockReturnValue(false)
    // expect(validSpy).not.toBeCalled()
    const result = () => walletHelper.getExternalWalletInfo(ExternalWalletType.Metro, ExternalWalletInterface.Transit)
    expect(result).toThrow(Error)
    expect(result).toThrow('Not a valid external wallet type: metro')
    // expect(validSpy).toBeCalledWith('metro', 'transit')
  })
})
