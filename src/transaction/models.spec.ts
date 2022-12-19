import { ChainNetwork } from '../models'
import { TransactionData, TransactionSignOptions } from './models'

function isTransactionData(obj: any): obj is TransactionData {
  console.log(`signOptions: ${JSON.stringify(typeof obj.signOptions)}`)
  return (
    'account' in obj &&
    obj.account === 'account value' &&
    'chainAccount' in obj &&
    obj.chainAccount === 'chainAccount value' &&
    'chainNetwork' in obj &&
    obj.chainNetwork === 'algo_beta' &&
    'expireSeconds' in obj &&
    obj.expireSeconds === 5 &&
    'signedTransaction' in obj &&
    'stx' in obj.signedTransaction &&
    obj.signedTransaction.stx === 'stx value' &&
    'transaction' in obj &&
    'tx' in obj.transaction &&
    obj.transaction.tx === 'tx value' &&
    'encodedSignedTransaction' in obj &&
    obj.encodedSignedTransaction === 'encodedSignedTransaction value' &&
    'encodedTransaction' in obj &&
    obj.encodedTransaction === 'encodedTransaction value' &&
    'transactionChainAccount' in obj &&
    obj.transactionChainAccount === 'transactionChainAccount value' &&
    'transactionRecordId' in obj &&
    obj.transactionRecordId === 'transactionRecordId value' &&
    'signOptions' in obj
  )
}

const tso: TransactionSignOptions = {}

const td: TransactionData = {
  account: 'account value',
  chainAccount: 'chainAccount value',
  chainNetwork: ChainNetwork.AlgoBeta,
  expireSeconds: 5,
  signedTransaction: { stx: 'stx value' },
  transaction: { tx: 'tx value' },
  encodedSignedTransaction: 'encodedSignedTransaction value',
  encodedTransaction: 'encodedTransaction value',
  transactionChainAccount: 'transactionChainAccount value',
  transactionRecordId: 'transactionRecordId value',
  signOptions: tso,
}

describe('Transaction Data type', () => {
  test('type can be instantiated', () => {
    expect(isTransactionData(td)).toBeTruthy()
  })
})
