import OreIdContext from '../../core/IOreidContext'
import { ApiEndpoint, ChainNetwork, RequestType, ValidateTransactionFees, ValidateTransactionResources} from '../../models'
import { assertHasApiKeyOrAccessToken, assertParamsHaveRequiredValues } from '../helpers'
import { ApiResultWithErrorCode } from '../models'

export type ValidateTransactionParams = {
  chainNetwork: ChainNetwork
  encodedTransaction?: string
  transactionChainAccount?: string
  transactionOptionsStringified?: string
  transactionRecordId?: string
}

export type ApiValidateTransactionBodyParams = {
  chain_network: ChainNetwork
  encoded_transaction?: string
  transaction_chain_account?: string
  transaction_options_stringified?: string
  transaction_record_id?: string
}
  
export type ValidateTransactionPayerParams = {
  chainNetwork: ChainNetwork
  encodedTransaction?: string
  payerChainAccount: string
  transactionChainAccount?: string
  transactionOptionsStringified?: string
  transactionRecordId?: string
}

export type ApiValidateTransactionPayerBodyParams = {
  chain_network: ChainNetwork
  encoded_transaction?: string
  payer_chain_account: string
  transaction_chain_account?: string
  transaction_options_stringified?: string
  transaction_record_id?: string
}

export type ValidateTransactionResult = {
  isValid: boolean
  canChange: boolean
  validFrom: string
  validTo: string
  errorMessage: string
  fees: ValidateTransactionFees
  resources: ValidateTransactionResources
  actions: string[]
} & ApiResultWithErrorCode

export async function callApiValidateTransaction(
  oreIdContext: OreIdContext,
  params: ValidateTransactionParams,
): Promise<ValidateTransactionResult> {
  const apiName = ApiEndpoint.ValidateTransaction

  const { chainNetwork, encodedTransaction, transactionChainAccount, transactionOptionsStringified, transactionRecordId } = params
  const body: ApiValidateTransactionBodyParams = {
    chain_network: chainNetwork,
    encoded_transaction: encodedTransaction,
    transaction_chain_account: transactionChainAccount,
    transaction_options_stringified: transactionOptionsStringified,
    transaction_record_id: transactionRecordId
  }

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['chainNetwork'], apiName)

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.ValidateTransaction, body, null)
  return results
}

export async function callApiValidatePayerTransaction(
    oreIdContext: OreIdContext,
    params: ValidateTransactionPayerParams,
): Promise<ValidateTransactionResult> {
  const apiName = ApiEndpoint.ValidatePayerTransaction
  
  const { chainNetwork, encodedTransaction, payerChainAccount, transactionChainAccount, transactionOptionsStringified, transactionRecordId } = params
  
  const body: ApiValidateTransactionPayerBodyParams = {
      chain_network: chainNetwork,
      encoded_transaction: encodedTransaction,
      payer_chain_account: payerChainAccount,
      transaction_chain_account: transactionChainAccount,
      transaction_options_stringified: transactionOptionsStringified,
      transaction_record_id: transactionRecordId
  }

  assertHasApiKeyOrAccessToken(oreIdContext, apiName)
  assertParamsHaveRequiredValues(params, ['chainNetwork', 'payerChainAccount'], apiName)

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.ValidatePayerTransaction, body, null)
  return results
}
