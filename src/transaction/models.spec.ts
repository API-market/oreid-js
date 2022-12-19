import { TransactionData } from './models'

function isTransactionData(obj: any): obj is TransactionData {
  return 'accessToken' in obj && obj.accessToken === 'accessToken value'
}

const td: TransactionData = {
  accessToken: 'accessToken value',
  appId: 'appId value',
  backgroundColor: 'backgroundColor value',
  oreIdUrl: 'oreIdUrl value',
  eosTransitWalletProviders: ['eosTransitWalletProviders value'],
}

describe('Transaction Data type', () => {
  test('type can be instantiated', () => {
    expect(isTransactionData(td)).toBeTruthy()
  })
})
