import OreIdContext from '../../core/IOreidContext'
import {
  AccountName,
  ApiEndpoint,
  ChainAccount,
  ChainNetwork,
  ProcessId,
  RequestType,
  ApiKeyUsedFor,
  TransactionData,
} from '../../models'
import { assertHasApiKey, assertParamsHaveOnlyOneOfValues, assertParamsHaveRequiredValues } from '../helpers'
import Helpers from '../../utils/helpers'

export type ApiCanAutosignTransactionBodyParams = {
  account: AccountName
  chain_account: ChainAccount
  chain_network: ChainNetwork
  signed_transaction?: string
  transaction?: string
  transaction_chain_acccount?: string
}

export type ApiCanAutosignTransactionResult = {
  autoSignCredentialsExist: boolean
  canCreateAutoSignCredentials: boolean
  maxAutoSignValidForInSeconds: number
  processId: ProcessId
}

/** Call api transaction/can-auto-sign
 * Requires a apiKey with the autoSign right
 * Returns: true if transaction provided can be signed using the signTransaction(autosign:true)
 * */
export async function callApiCanAutosignTransaction(
  oreIdContext: OreIdContext,
  params: TransactionData,
): Promise<ApiCanAutosignTransactionResult> {
  const apiName = ApiEndpoint.CanAutoSign
  const { account, chainAccount, chainNetwork, signedTransaction, transaction, transactionChainAccount } = params

  assertHasApiKey(oreIdContext, ApiKeyUsedFor.AutoSigning, apiName)
  assertParamsHaveRequiredValues(params, ['account', 'chainNetwork', 'chainAccount'], apiName)
  assertParamsHaveOnlyOneOfValues(params, ['transaction', 'signedTransaction'], apiName)

  const body: ApiCanAutosignTransactionBodyParams = {
    account,
    chain_account: chainAccount,
    chain_network: chainNetwork,
  }

  if (transaction) body.transaction = Helpers.base64Encode(transaction)
  if (signedTransaction) body.signed_transaction = Helpers.base64Encode(signedTransaction)
  if (transaction) body.transaction_chain_acccount = transactionChainAccount

  const results = await oreIdContext.callOreIdApi(RequestType.Post, ApiEndpoint.CanAutoSign, body, null)
  return results
}
